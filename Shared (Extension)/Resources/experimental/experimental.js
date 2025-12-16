(() => {
  // node_modules/alpinejs/dist/module.esm.js
  var flushPending = false;
  var flushing = false;
  var queue = [];
  function scheduler(callback) {
    queueJob(callback);
  }
  function queueJob(job) {
    if (!queue.includes(job))
      queue.push(job);
    queueFlush();
  }
  function dequeueJob(job) {
    let index = queue.indexOf(job);
    if (index !== -1)
      queue.splice(index, 1);
  }
  function queueFlush() {
    if (!flushing && !flushPending) {
      flushPending = true;
      queueMicrotask(flushJobs);
    }
  }
  function flushJobs() {
    flushPending = false;
    flushing = true;
    for (let i = 0; i < queue.length; i++) {
      queue[i]();
    }
    queue.length = 0;
    flushing = false;
  }
  var reactive;
  var effect;
  var release;
  var raw;
  var shouldSchedule = true;
  function disableEffectScheduling(callback) {
    shouldSchedule = false;
    callback();
    shouldSchedule = true;
  }
  function setReactivityEngine(engine) {
    reactive = engine.reactive;
    release = engine.release;
    effect = (callback) => engine.effect(callback, { scheduler: (task) => {
      if (shouldSchedule) {
        scheduler(task);
      } else {
        task();
      }
    } });
    raw = engine.raw;
  }
  function overrideEffect(override) {
    effect = override;
  }
  function elementBoundEffect(el) {
    let cleanup2 = () => {
    };
    let wrappedEffect = (callback) => {
      let effectReference = effect(callback);
      if (!el._x_effects) {
        el._x_effects = /* @__PURE__ */ new Set();
        el._x_runEffects = () => {
          el._x_effects.forEach((i) => i());
        };
      }
      el._x_effects.add(effectReference);
      cleanup2 = () => {
        if (effectReference === void 0)
          return;
        el._x_effects.delete(effectReference);
        release(effectReference);
      };
      return effectReference;
    };
    return [wrappedEffect, () => {
      cleanup2();
    }];
  }
  var onAttributeAddeds = [];
  var onElRemoveds = [];
  var onElAddeds = [];
  function onElAdded(callback) {
    onElAddeds.push(callback);
  }
  function onElRemoved(el, callback) {
    if (typeof callback === "function") {
      if (!el._x_cleanups)
        el._x_cleanups = [];
      el._x_cleanups.push(callback);
    } else {
      callback = el;
      onElRemoveds.push(callback);
    }
  }
  function onAttributesAdded(callback) {
    onAttributeAddeds.push(callback);
  }
  function onAttributeRemoved(el, name, callback) {
    if (!el._x_attributeCleanups)
      el._x_attributeCleanups = {};
    if (!el._x_attributeCleanups[name])
      el._x_attributeCleanups[name] = [];
    el._x_attributeCleanups[name].push(callback);
  }
  function cleanupAttributes(el, names) {
    if (!el._x_attributeCleanups)
      return;
    Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
      if (names === void 0 || names.includes(name)) {
        value.forEach((i) => i());
        delete el._x_attributeCleanups[name];
      }
    });
  }
  var observer = new MutationObserver(onMutate);
  var currentlyObserving = false;
  function startObservingMutations() {
    observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
    currentlyObserving = true;
  }
  function stopObservingMutations() {
    flushObserver();
    observer.disconnect();
    currentlyObserving = false;
  }
  var recordQueue = [];
  var willProcessRecordQueue = false;
  function flushObserver() {
    recordQueue = recordQueue.concat(observer.takeRecords());
    if (recordQueue.length && !willProcessRecordQueue) {
      willProcessRecordQueue = true;
      queueMicrotask(() => {
        processRecordQueue();
        willProcessRecordQueue = false;
      });
    }
  }
  function processRecordQueue() {
    onMutate(recordQueue);
    recordQueue.length = 0;
  }
  function mutateDom(callback) {
    if (!currentlyObserving)
      return callback();
    stopObservingMutations();
    let result = callback();
    startObservingMutations();
    return result;
  }
  var isCollecting = false;
  var deferredMutations = [];
  function deferMutations() {
    isCollecting = true;
  }
  function flushAndStopDeferringMutations() {
    isCollecting = false;
    onMutate(deferredMutations);
    deferredMutations = [];
  }
  function onMutate(mutations) {
    if (isCollecting) {
      deferredMutations = deferredMutations.concat(mutations);
      return;
    }
    let addedNodes = [];
    let removedNodes = [];
    let addedAttributes = /* @__PURE__ */ new Map();
    let removedAttributes = /* @__PURE__ */ new Map();
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].target._x_ignoreMutationObserver)
        continue;
      if (mutations[i].type === "childList") {
        mutations[i].addedNodes.forEach((node) => node.nodeType === 1 && addedNodes.push(node));
        mutations[i].removedNodes.forEach((node) => node.nodeType === 1 && removedNodes.push(node));
      }
      if (mutations[i].type === "attributes") {
        let el = mutations[i].target;
        let name = mutations[i].attributeName;
        let oldValue = mutations[i].oldValue;
        let add2 = () => {
          if (!addedAttributes.has(el))
            addedAttributes.set(el, []);
          addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
        };
        let remove = () => {
          if (!removedAttributes.has(el))
            removedAttributes.set(el, []);
          removedAttributes.get(el).push(name);
        };
        if (el.hasAttribute(name) && oldValue === null) {
          add2();
        } else if (el.hasAttribute(name)) {
          remove();
          add2();
        } else {
          remove();
        }
      }
    }
    removedAttributes.forEach((attrs, el) => {
      cleanupAttributes(el, attrs);
    });
    addedAttributes.forEach((attrs, el) => {
      onAttributeAddeds.forEach((i) => i(el, attrs));
    });
    for (let node of removedNodes) {
      if (addedNodes.includes(node))
        continue;
      onElRemoveds.forEach((i) => i(node));
      if (node._x_cleanups) {
        while (node._x_cleanups.length)
          node._x_cleanups.pop()();
      }
    }
    addedNodes.forEach((node) => {
      node._x_ignoreSelf = true;
      node._x_ignore = true;
    });
    for (let node of addedNodes) {
      if (removedNodes.includes(node))
        continue;
      if (!node.isConnected)
        continue;
      delete node._x_ignoreSelf;
      delete node._x_ignore;
      onElAddeds.forEach((i) => i(node));
      node._x_ignore = true;
      node._x_ignoreSelf = true;
    }
    addedNodes.forEach((node) => {
      delete node._x_ignoreSelf;
      delete node._x_ignore;
    });
    addedNodes = null;
    removedNodes = null;
    addedAttributes = null;
    removedAttributes = null;
  }
  function scope(node) {
    return mergeProxies(closestDataStack(node));
  }
  function addScopeToNode(node, data2, referenceNode) {
    node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
    return () => {
      node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
    };
  }
  function refreshScope(element, scope2) {
    let existingScope = element._x_dataStack[0];
    Object.entries(scope2).forEach(([key, value]) => {
      existingScope[key] = value;
    });
  }
  function closestDataStack(node) {
    if (node._x_dataStack)
      return node._x_dataStack;
    if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
      return closestDataStack(node.host);
    }
    if (!node.parentNode) {
      return [];
    }
    return closestDataStack(node.parentNode);
  }
  function mergeProxies(objects) {
    let thisProxy = new Proxy({}, {
      ownKeys: () => {
        return Array.from(new Set(objects.flatMap((i) => Object.keys(i))));
      },
      has: (target, name) => {
        return objects.some((obj) => obj.hasOwnProperty(name));
      },
      get: (target, name) => {
        return (objects.find((obj) => {
          if (obj.hasOwnProperty(name)) {
            let descriptor = Object.getOwnPropertyDescriptor(obj, name);
            if (descriptor.get && descriptor.get._x_alreadyBound || descriptor.set && descriptor.set._x_alreadyBound) {
              return true;
            }
            if ((descriptor.get || descriptor.set) && descriptor.enumerable) {
              let getter = descriptor.get;
              let setter = descriptor.set;
              let property = descriptor;
              getter = getter && getter.bind(thisProxy);
              setter = setter && setter.bind(thisProxy);
              if (getter)
                getter._x_alreadyBound = true;
              if (setter)
                setter._x_alreadyBound = true;
              Object.defineProperty(obj, name, {
                ...property,
                get: getter,
                set: setter
              });
            }
            return true;
          }
          return false;
        }) || {})[name];
      },
      set: (target, name, value) => {
        let closestObjectWithKey = objects.find((obj) => obj.hasOwnProperty(name));
        if (closestObjectWithKey) {
          closestObjectWithKey[name] = value;
        } else {
          objects[objects.length - 1][name] = value;
        }
        return true;
      }
    });
    return thisProxy;
  }
  function initInterceptors(data2) {
    let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
    let recurse = (obj, basePath = "") => {
      Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
        if (enumerable === false || value === void 0)
          return;
        let path = basePath === "" ? key : `${basePath}.${key}`;
        if (typeof value === "object" && value !== null && value._x_interceptor) {
          obj[key] = value.initialize(data2, path, key);
        } else {
          if (isObject2(value) && value !== obj && !(value instanceof Element)) {
            recurse(value, path);
          }
        }
      });
    };
    return recurse(data2);
  }
  function interceptor(callback, mutateObj = () => {
  }) {
    let obj = {
      initialValue: void 0,
      _x_interceptor: true,
      initialize(data2, path, key) {
        return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
      }
    };
    mutateObj(obj);
    return (initialValue) => {
      if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
        let initialize = obj.initialize.bind(obj);
        obj.initialize = (data2, path, key) => {
          let innerValue = initialValue.initialize(data2, path, key);
          obj.initialValue = innerValue;
          return initialize(data2, path, key);
        };
      } else {
        obj.initialValue = initialValue;
      }
      return obj;
    };
  }
  function get(obj, path) {
    return path.split(".").reduce((carry, segment) => carry[segment], obj);
  }
  function set(obj, path, value) {
    if (typeof path === "string")
      path = path.split(".");
    if (path.length === 1)
      obj[path[0]] = value;
    else if (path.length === 0)
      throw error;
    else {
      if (obj[path[0]])
        return set(obj[path[0]], path.slice(1), value);
      else {
        obj[path[0]] = {};
        return set(obj[path[0]], path.slice(1), value);
      }
    }
  }
  var magics = {};
  function magic(name, callback) {
    magics[name] = callback;
  }
  function injectMagics(obj, el) {
    Object.entries(magics).forEach(([name, callback]) => {
      Object.defineProperty(obj, `$${name}`, {
        get() {
          let [utilities, cleanup2] = getElementBoundUtilities(el);
          utilities = { interceptor, ...utilities };
          onElRemoved(el, cleanup2);
          return callback(el, utilities);
        },
        enumerable: false
      });
    });
    return obj;
  }
  function tryCatch(el, expression, callback, ...args) {
    try {
      return callback(...args);
    } catch (e) {
      handleError(e, el, expression);
    }
  }
  function handleError(error2, el, expression = void 0) {
    Object.assign(error2, { el, expression });
    console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
    setTimeout(() => {
      throw error2;
    }, 0);
  }
  var shouldAutoEvaluateFunctions = true;
  function dontAutoEvaluateFunctions(callback) {
    let cache = shouldAutoEvaluateFunctions;
    shouldAutoEvaluateFunctions = false;
    callback();
    shouldAutoEvaluateFunctions = cache;
  }
  function evaluate(el, expression, extras = {}) {
    let result;
    evaluateLater(el, expression)((value) => result = value, extras);
    return result;
  }
  function evaluateLater(...args) {
    return theEvaluatorFunction(...args);
  }
  var theEvaluatorFunction = normalEvaluator;
  function setEvaluator(newEvaluator) {
    theEvaluatorFunction = newEvaluator;
  }
  function normalEvaluator(el, expression) {
    let overriddenMagics = {};
    injectMagics(overriddenMagics, el);
    let dataStack = [overriddenMagics, ...closestDataStack(el)];
    if (typeof expression === "function") {
      return generateEvaluatorFromFunction(dataStack, expression);
    }
    let evaluator = generateEvaluatorFromString(dataStack, expression, el);
    return tryCatch.bind(null, el, expression, evaluator);
  }
  function generateEvaluatorFromFunction(dataStack, func) {
    return (receiver = () => {
    }, { scope: scope2 = {}, params = [] } = {}) => {
      let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
      runIfTypeOfFunction(receiver, result);
    };
  }
  var evaluatorMemo = {};
  function generateFunctionFromString(expression, el) {
    if (evaluatorMemo[expression]) {
      return evaluatorMemo[expression];
    }
    let AsyncFunction = Object.getPrototypeOf(async function() {
    }).constructor;
    let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression) || /^(let|const)\s/.test(expression) ? `(() => { ${expression} })()` : expression;
    const safeAsyncFunction = () => {
      try {
        return new AsyncFunction(["__self", "scope"], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`);
      } catch (error2) {
        handleError(error2, el, expression);
        return Promise.resolve();
      }
    };
    let func = safeAsyncFunction();
    evaluatorMemo[expression] = func;
    return func;
  }
  function generateEvaluatorFromString(dataStack, expression, el) {
    let func = generateFunctionFromString(expression, el);
    return (receiver = () => {
    }, { scope: scope2 = {}, params = [] } = {}) => {
      func.result = void 0;
      func.finished = false;
      let completeScope = mergeProxies([scope2, ...dataStack]);
      if (typeof func === "function") {
        let promise = func(func, completeScope).catch((error2) => handleError(error2, el, expression));
        if (func.finished) {
          runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
          func.result = void 0;
        } else {
          promise.then((result) => {
            runIfTypeOfFunction(receiver, result, completeScope, params, el);
          }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
        }
      }
    };
  }
  function runIfTypeOfFunction(receiver, value, scope2, params, el) {
    if (shouldAutoEvaluateFunctions && typeof value === "function") {
      let result = value.apply(scope2, params);
      if (result instanceof Promise) {
        result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
      } else {
        receiver(result);
      }
    } else {
      receiver(value);
    }
  }
  var prefixAsString = "x-";
  function prefix(subject = "") {
    return prefixAsString + subject;
  }
  function setPrefix(newPrefix) {
    prefixAsString = newPrefix;
  }
  var directiveHandlers = {};
  function directive(name, callback) {
    directiveHandlers[name] = callback;
  }
  function directives(el, attributes, originalAttributeOverride) {
    attributes = Array.from(attributes);
    if (el._x_virtualDirectives) {
      let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
      let staticAttributes = attributesOnly(vAttributes);
      vAttributes = vAttributes.map((attribute) => {
        if (staticAttributes.find((attr) => attr.name === attribute.name)) {
          return {
            name: `x-bind:${attribute.name}`,
            value: `"${attribute.value}"`
          };
        }
        return attribute;
      });
      attributes = attributes.concat(vAttributes);
    }
    let transformedAttributeMap = {};
    let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
    return directives2.map((directive2) => {
      return getDirectiveHandler(el, directive2);
    });
  }
  function attributesOnly(attributes) {
    return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
  }
  var isDeferringHandlers = false;
  var directiveHandlerStacks = /* @__PURE__ */ new Map();
  var currentHandlerStackKey = Symbol();
  function deferHandlingDirectives(callback) {
    isDeferringHandlers = true;
    let key = Symbol();
    currentHandlerStackKey = key;
    directiveHandlerStacks.set(key, []);
    let flushHandlers = () => {
      while (directiveHandlerStacks.get(key).length)
        directiveHandlerStacks.get(key).shift()();
      directiveHandlerStacks.delete(key);
    };
    let stopDeferring = () => {
      isDeferringHandlers = false;
      flushHandlers();
    };
    callback(flushHandlers);
    stopDeferring();
  }
  function getElementBoundUtilities(el) {
    let cleanups = [];
    let cleanup2 = (callback) => cleanups.push(callback);
    let [effect3, cleanupEffect] = elementBoundEffect(el);
    cleanups.push(cleanupEffect);
    let utilities = {
      Alpine: alpine_default,
      effect: effect3,
      cleanup: cleanup2,
      evaluateLater: evaluateLater.bind(evaluateLater, el),
      evaluate: evaluate.bind(evaluate, el)
    };
    let doCleanup = () => cleanups.forEach((i) => i());
    return [utilities, doCleanup];
  }
  function getDirectiveHandler(el, directive2) {
    let noop = () => {
    };
    let handler3 = directiveHandlers[directive2.type] || noop;
    let [utilities, cleanup2] = getElementBoundUtilities(el);
    onAttributeRemoved(el, directive2.original, cleanup2);
    let fullHandler = () => {
      if (el._x_ignore || el._x_ignoreSelf)
        return;
      handler3.inline && handler3.inline(el, directive2, utilities);
      handler3 = handler3.bind(handler3, el, directive2, utilities);
      isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler3) : handler3();
    };
    fullHandler.runCleanups = cleanup2;
    return fullHandler;
  }
  var startingWith = (subject, replacement) => ({ name, value }) => {
    if (name.startsWith(subject))
      name = name.replace(subject, replacement);
    return { name, value };
  };
  var into = (i) => i;
  function toTransformedAttributes(callback = () => {
  }) {
    return ({ name, value }) => {
      let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
        return transform(carry);
      }, { name, value });
      if (newName !== name)
        callback(newName, name);
      return { name: newName, value: newValue };
    };
  }
  var attributeTransformers = [];
  function mapAttributes(callback) {
    attributeTransformers.push(callback);
  }
  function outNonAlpineAttributes({ name }) {
    return alpineAttributeRegex().test(name);
  }
  var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
  function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
    return ({ name, value }) => {
      let typeMatch = name.match(alpineAttributeRegex());
      let valueMatch = name.match(/:([a-zA-Z0-9\-:]+)/);
      let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
      let original = originalAttributeOverride || transformedAttributeMap[name] || name;
      return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map((i) => i.replace(".", "")),
        expression: value,
        original
      };
    };
  }
  var DEFAULT = "DEFAULT";
  var directiveOrder = [
    "ignore",
    "ref",
    "data",
    "id",
    "radio",
    "tabs",
    "switch",
    "disclosure",
    "menu",
    "listbox",
    "list",
    "item",
    "combobox",
    "bind",
    "init",
    "for",
    "mask",
    "model",
    "modelable",
    "transition",
    "show",
    "if",
    DEFAULT,
    "teleport"
  ];
  function byPriority(a, b) {
    let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
    let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
    return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
  }
  function dispatch(el, name, detail = {}) {
    el.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true
    }));
  }
  var tickStack = [];
  var isHolding = false;
  function nextTick(callback = () => {
  }) {
    queueMicrotask(() => {
      isHolding || setTimeout(() => {
        releaseNextTicks();
      });
    });
    return new Promise((res) => {
      tickStack.push(() => {
        callback();
        res();
      });
    });
  }
  function releaseNextTicks() {
    isHolding = false;
    while (tickStack.length)
      tickStack.shift()();
  }
  function holdNextTicks() {
    isHolding = true;
  }
  function walk(el, callback) {
    if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
      Array.from(el.children).forEach((el2) => walk(el2, callback));
      return;
    }
    let skip = false;
    callback(el, () => skip = true);
    if (skip)
      return;
    let node = el.firstElementChild;
    while (node) {
      walk(node, callback, false);
      node = node.nextElementSibling;
    }
  }
  function warn(message, ...args) {
    console.warn(`Alpine Warning: ${message}`, ...args);
  }
  function start() {
    if (!document.body)
      warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
    dispatch(document, "alpine:init");
    dispatch(document, "alpine:initializing");
    startObservingMutations();
    onElAdded((el) => initTree(el, walk));
    onElRemoved((el) => destroyTree(el));
    onAttributesAdded((el, attrs) => {
      directives(el, attrs).forEach((handle) => handle());
    });
    let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
    Array.from(document.querySelectorAll(allSelectors())).filter(outNestedComponents).forEach((el) => {
      initTree(el);
    });
    dispatch(document, "alpine:initialized");
  }
  var rootSelectorCallbacks = [];
  var initSelectorCallbacks = [];
  function rootSelectors() {
    return rootSelectorCallbacks.map((fn) => fn());
  }
  function allSelectors() {
    return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
  }
  function addRootSelector(selectorCallback) {
    rootSelectorCallbacks.push(selectorCallback);
  }
  function addInitSelector(selectorCallback) {
    initSelectorCallbacks.push(selectorCallback);
  }
  function closestRoot(el, includeInitSelectors = false) {
    return findClosest(el, (element) => {
      const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
      if (selectors.some((selector) => element.matches(selector)))
        return true;
    });
  }
  function findClosest(el, callback) {
    if (!el)
      return;
    if (callback(el))
      return el;
    if (el._x_teleportBack)
      el = el._x_teleportBack;
    if (!el.parentElement)
      return;
    return findClosest(el.parentElement, callback);
  }
  function isRoot(el) {
    return rootSelectors().some((selector) => el.matches(selector));
  }
  function initTree(el, walker = walk) {
    deferHandlingDirectives(() => {
      walker(el, (el2, skip) => {
        directives(el2, el2.attributes).forEach((handle) => handle());
        el2._x_ignore && skip();
      });
    });
  }
  function destroyTree(root) {
    walk(root, (el) => cleanupAttributes(el));
  }
  function setClasses(el, value) {
    if (Array.isArray(value)) {
      return setClassesFromString(el, value.join(" "));
    } else if (typeof value === "object" && value !== null) {
      return setClassesFromObject(el, value);
    } else if (typeof value === "function") {
      return setClasses(el, value());
    }
    return setClassesFromString(el, value);
  }
  function setClassesFromString(el, classString) {
    let split = (classString2) => classString2.split(" ").filter(Boolean);
    let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
    let addClassesAndReturnUndo = (classes) => {
      el.classList.add(...classes);
      return () => {
        el.classList.remove(...classes);
      };
    };
    classString = classString === true ? classString = "" : classString || "";
    return addClassesAndReturnUndo(missingClasses(classString));
  }
  function setClassesFromObject(el, classObject) {
    let split = (classString) => classString.split(" ").filter(Boolean);
    let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
    let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
    let added = [];
    let removed = [];
    forRemove.forEach((i) => {
      if (el.classList.contains(i)) {
        el.classList.remove(i);
        removed.push(i);
      }
    });
    forAdd.forEach((i) => {
      if (!el.classList.contains(i)) {
        el.classList.add(i);
        added.push(i);
      }
    });
    return () => {
      removed.forEach((i) => el.classList.add(i));
      added.forEach((i) => el.classList.remove(i));
    };
  }
  function setStyles(el, value) {
    if (typeof value === "object" && value !== null) {
      return setStylesFromObject(el, value);
    }
    return setStylesFromString(el, value);
  }
  function setStylesFromObject(el, value) {
    let previousStyles = {};
    Object.entries(value).forEach(([key, value2]) => {
      previousStyles[key] = el.style[key];
      if (!key.startsWith("--")) {
        key = kebabCase(key);
      }
      el.style.setProperty(key, value2);
    });
    setTimeout(() => {
      if (el.style.length === 0) {
        el.removeAttribute("style");
      }
    });
    return () => {
      setStyles(el, previousStyles);
    };
  }
  function setStylesFromString(el, value) {
    let cache = el.getAttribute("style", value);
    el.setAttribute("style", value);
    return () => {
      el.setAttribute("style", cache || "");
    };
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function once(callback, fallback = () => {
  }) {
    let called = false;
    return function() {
      if (!called) {
        called = true;
        callback.apply(this, arguments);
      } else {
        fallback.apply(this, arguments);
      }
    };
  }
  directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
    if (typeof expression === "function")
      expression = evaluate2(expression);
    if (!expression) {
      registerTransitionsFromHelper(el, modifiers, value);
    } else {
      registerTransitionsFromClassString(el, expression, value);
    }
  });
  function registerTransitionsFromClassString(el, classString, stage) {
    registerTransitionObject(el, setClasses, "");
    let directiveStorageMap = {
      enter: (classes) => {
        el._x_transition.enter.during = classes;
      },
      "enter-start": (classes) => {
        el._x_transition.enter.start = classes;
      },
      "enter-end": (classes) => {
        el._x_transition.enter.end = classes;
      },
      leave: (classes) => {
        el._x_transition.leave.during = classes;
      },
      "leave-start": (classes) => {
        el._x_transition.leave.start = classes;
      },
      "leave-end": (classes) => {
        el._x_transition.leave.end = classes;
      }
    };
    directiveStorageMap[stage](classString);
  }
  function registerTransitionsFromHelper(el, modifiers, stage) {
    registerTransitionObject(el, setStyles);
    let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
    let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
    let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
    if (modifiers.includes("in") && !doesntSpecify) {
      modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
    }
    if (modifiers.includes("out") && !doesntSpecify) {
      modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
    }
    let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
    let wantsOpacity = wantsAll || modifiers.includes("opacity");
    let wantsScale = wantsAll || modifiers.includes("scale");
    let opacityValue = wantsOpacity ? 0 : 1;
    let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
    let delay = modifierValue(modifiers, "delay", 0);
    let origin = modifierValue(modifiers, "origin", "center");
    let property = "opacity, transform";
    let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
    let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
    let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
    if (transitioningIn) {
      el._x_transition.enter.during = {
        transformOrigin: origin,
        transitionDelay: delay,
        transitionProperty: property,
        transitionDuration: `${durationIn}s`,
        transitionTimingFunction: easing
      };
      el._x_transition.enter.start = {
        opacity: opacityValue,
        transform: `scale(${scaleValue})`
      };
      el._x_transition.enter.end = {
        opacity: 1,
        transform: `scale(1)`
      };
    }
    if (transitioningOut) {
      el._x_transition.leave.during = {
        transformOrigin: origin,
        transitionDelay: delay,
        transitionProperty: property,
        transitionDuration: `${durationOut}s`,
        transitionTimingFunction: easing
      };
      el._x_transition.leave.start = {
        opacity: 1,
        transform: `scale(1)`
      };
      el._x_transition.leave.end = {
        opacity: opacityValue,
        transform: `scale(${scaleValue})`
      };
    }
  }
  function registerTransitionObject(el, setFunction, defaultValue = {}) {
    if (!el._x_transition)
      el._x_transition = {
        enter: { during: defaultValue, start: defaultValue, end: defaultValue },
        leave: { during: defaultValue, start: defaultValue, end: defaultValue },
        in(before = () => {
        }, after = () => {
        }) {
          transition(el, setFunction, {
            during: this.enter.during,
            start: this.enter.start,
            end: this.enter.end
          }, before, after);
        },
        out(before = () => {
        }, after = () => {
        }) {
          transition(el, setFunction, {
            during: this.leave.during,
            start: this.leave.start,
            end: this.leave.end
          }, before, after);
        }
      };
  }
  window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
    const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
    let clickAwayCompatibleShow = () => nextTick2(show);
    if (value) {
      if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
        el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
      } else {
        el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
      }
      return;
    }
    el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
      el._x_transition.out(() => {
      }, () => resolve(hide));
      el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
    }) : Promise.resolve(hide);
    queueMicrotask(() => {
      let closest = closestHide(el);
      if (closest) {
        if (!closest._x_hideChildren)
          closest._x_hideChildren = [];
        closest._x_hideChildren.push(el);
      } else {
        nextTick2(() => {
          let hideAfterChildren = (el2) => {
            let carry = Promise.all([
              el2._x_hidePromise,
              ...(el2._x_hideChildren || []).map(hideAfterChildren)
            ]).then(([i]) => i());
            delete el2._x_hidePromise;
            delete el2._x_hideChildren;
            return carry;
          };
          hideAfterChildren(el).catch((e) => {
            if (!e.isFromCancelledTransition)
              throw e;
          });
        });
      }
    });
  };
  function closestHide(el) {
    let parent = el.parentNode;
    if (!parent)
      return;
    return parent._x_hidePromise ? parent : closestHide(parent);
  }
  function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
  }, after = () => {
  }) {
    if (el._x_transitioning)
      el._x_transitioning.cancel();
    if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
      before();
      after();
      return;
    }
    let undoStart, undoDuring, undoEnd;
    performTransition(el, {
      start() {
        undoStart = setFunction(el, start2);
      },
      during() {
        undoDuring = setFunction(el, during);
      },
      before,
      end() {
        undoStart();
        undoEnd = setFunction(el, end);
      },
      after,
      cleanup() {
        undoDuring();
        undoEnd();
      }
    });
  }
  function performTransition(el, stages) {
    let interrupted, reachedBefore, reachedEnd;
    let finish = once(() => {
      mutateDom(() => {
        interrupted = true;
        if (!reachedBefore)
          stages.before();
        if (!reachedEnd) {
          stages.end();
          releaseNextTicks();
        }
        stages.after();
        if (el.isConnected)
          stages.cleanup();
        delete el._x_transitioning;
      });
    });
    el._x_transitioning = {
      beforeCancels: [],
      beforeCancel(callback) {
        this.beforeCancels.push(callback);
      },
      cancel: once(function() {
        while (this.beforeCancels.length) {
          this.beforeCancels.shift()();
        }
        ;
        finish();
      }),
      finish
    };
    mutateDom(() => {
      stages.start();
      stages.during();
    });
    holdNextTicks();
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
      let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
      if (duration === 0)
        duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
      mutateDom(() => {
        stages.before();
      });
      reachedBefore = true;
      requestAnimationFrame(() => {
        if (interrupted)
          return;
        mutateDom(() => {
          stages.end();
        });
        releaseNextTicks();
        setTimeout(el._x_transitioning.finish, duration + delay);
        reachedEnd = true;
      });
    });
  }
  function modifierValue(modifiers, key, fallback) {
    if (modifiers.indexOf(key) === -1)
      return fallback;
    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue)
      return fallback;
    if (key === "scale") {
      if (isNaN(rawValue))
        return fallback;
    }
    if (key === "duration") {
      let match = rawValue.match(/([0-9]+)ms/);
      if (match)
        return match[1];
    }
    if (key === "origin") {
      if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
      }
    }
    return rawValue;
  }
  var isCloning = false;
  function skipDuringClone(callback, fallback = () => {
  }) {
    return (...args) => isCloning ? fallback(...args) : callback(...args);
  }
  function clone(oldEl, newEl) {
    if (!newEl._x_dataStack)
      newEl._x_dataStack = oldEl._x_dataStack;
    isCloning = true;
    dontRegisterReactiveSideEffects(() => {
      cloneTree(newEl);
    });
    isCloning = false;
  }
  function cloneTree(el) {
    let hasRunThroughFirstEl = false;
    let shallowWalker = (el2, callback) => {
      walk(el2, (el3, skip) => {
        if (hasRunThroughFirstEl && isRoot(el3))
          return skip();
        hasRunThroughFirstEl = true;
        callback(el3, skip);
      });
    };
    initTree(el, shallowWalker);
  }
  function dontRegisterReactiveSideEffects(callback) {
    let cache = effect;
    overrideEffect((callback2, el) => {
      let storedEffect = cache(callback2);
      release(storedEffect);
      return () => {
      };
    });
    callback();
    overrideEffect(cache);
  }
  function bind(el, name, value, modifiers = []) {
    if (!el._x_bindings)
      el._x_bindings = reactive({});
    el._x_bindings[name] = value;
    name = modifiers.includes("camel") ? camelCase(name) : name;
    switch (name) {
      case "value":
        bindInputValue(el, value);
        break;
      case "style":
        bindStyles(el, value);
        break;
      case "class":
        bindClasses(el, value);
        break;
      default:
        bindAttribute(el, name, value);
        break;
    }
  }
  function bindInputValue(el, value) {
    if (el.type === "radio") {
      if (el.attributes.value === void 0) {
        el.value = value;
      }
      if (window.fromModel) {
        el.checked = checkedAttrLooseCompare(el.value, value);
      }
    } else if (el.type === "checkbox") {
      if (Number.isInteger(value)) {
        el.value = value;
      } else if (!Number.isInteger(value) && !Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
        el.value = String(value);
      } else {
        if (Array.isArray(value)) {
          el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
        } else {
          el.checked = !!value;
        }
      }
    } else if (el.tagName === "SELECT") {
      updateSelect(el, value);
    } else {
      if (el.value === value)
        return;
      el.value = value;
    }
  }
  function bindClasses(el, value) {
    if (el._x_undoAddedClasses)
      el._x_undoAddedClasses();
    el._x_undoAddedClasses = setClasses(el, value);
  }
  function bindStyles(el, value) {
    if (el._x_undoAddedStyles)
      el._x_undoAddedStyles();
    el._x_undoAddedStyles = setStyles(el, value);
  }
  function bindAttribute(el, name, value) {
    if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
      el.removeAttribute(name);
    } else {
      if (isBooleanAttr(name))
        value = name;
      setIfChanged(el, name, value);
    }
  }
  function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) {
      el.setAttribute(attrName, value);
    }
  }
  function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map((value2) => {
      return value2 + "";
    });
    Array.from(el.options).forEach((option) => {
      option.selected = arrayWrappedValue.includes(option.value);
    });
  }
  function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB;
  }
  function isBooleanAttr(attrName) {
    const booleanAttributes = [
      "disabled",
      "checked",
      "required",
      "readonly",
      "hidden",
      "open",
      "selected",
      "autofocus",
      "itemscope",
      "multiple",
      "novalidate",
      "allowfullscreen",
      "allowpaymentrequest",
      "formnovalidate",
      "autoplay",
      "controls",
      "loop",
      "muted",
      "playsinline",
      "default",
      "ismap",
      "reversed",
      "async",
      "defer",
      "nomodule"
    ];
    return booleanAttributes.includes(attrName);
  }
  function attributeShouldntBePreservedIfFalsy(name) {
    return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
  }
  function getBinding(el, name, fallback) {
    if (el._x_bindings && el._x_bindings[name] !== void 0)
      return el._x_bindings[name];
    let attr = el.getAttribute(name);
    if (attr === null)
      return typeof fallback === "function" ? fallback() : fallback;
    if (attr === "")
      return true;
    if (isBooleanAttr(name)) {
      return !![name, "true"].includes(attr);
    }
    return attr;
  }
  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      let context = this, args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  function plugin(callback) {
    callback(alpine_default);
  }
  var stores = {};
  var isReactive = false;
  function store(name, value) {
    if (!isReactive) {
      stores = reactive(stores);
      isReactive = true;
    }
    if (value === void 0) {
      return stores[name];
    }
    stores[name] = value;
    if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
      stores[name].init();
    }
    initInterceptors(stores[name]);
  }
  function getStores() {
    return stores;
  }
  var binds = {};
  function bind2(name, bindings) {
    let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
    if (name instanceof Element) {
      applyBindingsObject(name, getBindings());
    } else {
      binds[name] = getBindings;
    }
  }
  function injectBindingProviders(obj) {
    Object.entries(binds).forEach(([name, callback]) => {
      Object.defineProperty(obj, name, {
        get() {
          return (...args) => {
            return callback(...args);
          };
        }
      });
    });
    return obj;
  }
  function applyBindingsObject(el, obj, original) {
    let cleanupRunners = [];
    while (cleanupRunners.length)
      cleanupRunners.pop()();
    let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(attributes);
    attributes = attributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    directives(el, attributes, original).map((handle) => {
      cleanupRunners.push(handle.runCleanups);
      handle();
    });
  }
  var datas = {};
  function data(name, callback) {
    datas[name] = callback;
  }
  function injectDataProviders(obj, context) {
    Object.entries(datas).forEach(([name, callback]) => {
      Object.defineProperty(obj, name, {
        get() {
          return (...args) => {
            return callback.bind(context)(...args);
          };
        },
        enumerable: false
      });
    });
    return obj;
  }
  var Alpine = {
    get reactive() {
      return reactive;
    },
    get release() {
      return release;
    },
    get effect() {
      return effect;
    },
    get raw() {
      return raw;
    },
    version: "3.10.5",
    flushAndStopDeferringMutations,
    dontAutoEvaluateFunctions,
    disableEffectScheduling,
    setReactivityEngine,
    closestDataStack,
    skipDuringClone,
    addRootSelector,
    addInitSelector,
    addScopeToNode,
    deferMutations,
    mapAttributes,
    evaluateLater,
    setEvaluator,
    mergeProxies,
    findClosest,
    closestRoot,
    interceptor,
    transition,
    setStyles,
    mutateDom,
    directive,
    throttle,
    debounce,
    evaluate,
    initTree,
    nextTick,
    prefixed: prefix,
    prefix: setPrefix,
    plugin,
    magic,
    store,
    start,
    clone,
    bound: getBinding,
    $data: scope,
    data,
    bind: bind2
  };
  var alpine_default = Alpine;
  function makeMap(str, expectsLowerCase) {
    const map = /* @__PURE__ */ Object.create(null);
    const list = str.split(",");
    for (let i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
  }
  var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
  var EMPTY_OBJ = true ? Object.freeze({}) : {};
  var EMPTY_ARR = true ? Object.freeze([]) : [];
  var extend = Object.assign;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = (val, key) => hasOwnProperty.call(val, key);
  var isArray = Array.isArray;
  var isMap = (val) => toTypeString(val) === "[object Map]";
  var isString = (val) => typeof val === "string";
  var isSymbol = (val) => typeof val === "symbol";
  var isObject = (val) => val !== null && typeof val === "object";
  var objectToString = Object.prototype.toString;
  var toTypeString = (value) => objectToString.call(value);
  var toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  var cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  var camelizeRE = /-(\w)/g;
  var camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  });
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
  var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
  var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
  var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
  var targetMap = /* @__PURE__ */ new WeakMap();
  var effectStack = [];
  var activeEffect;
  var ITERATE_KEY = Symbol(true ? "iterate" : "");
  var MAP_KEY_ITERATE_KEY = Symbol(true ? "Map key iterate" : "");
  function isEffect(fn) {
    return fn && fn._isEffect === true;
  }
  function effect2(fn, options = EMPTY_OBJ) {
    if (isEffect(fn)) {
      fn = fn.raw;
    }
    const effect3 = createReactiveEffect(fn, options);
    if (!options.lazy) {
      effect3();
    }
    return effect3;
  }
  function stop(effect3) {
    if (effect3.active) {
      cleanup(effect3);
      if (effect3.options.onStop) {
        effect3.options.onStop();
      }
      effect3.active = false;
    }
  }
  var uid = 0;
  function createReactiveEffect(fn, options) {
    const effect3 = function reactiveEffect() {
      if (!effect3.active) {
        return fn();
      }
      if (!effectStack.includes(effect3)) {
        cleanup(effect3);
        try {
          enableTracking();
          effectStack.push(effect3);
          activeEffect = effect3;
          return fn();
        } finally {
          effectStack.pop();
          resetTracking();
          activeEffect = effectStack[effectStack.length - 1];
        }
      }
    };
    effect3.id = uid++;
    effect3.allowRecurse = !!options.allowRecurse;
    effect3._isEffect = true;
    effect3.active = true;
    effect3.raw = fn;
    effect3.deps = [];
    effect3.options = options;
    return effect3;
  }
  function cleanup(effect3) {
    const { deps } = effect3;
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect3);
      }
      deps.length = 0;
    }
  }
  var shouldTrack = true;
  var trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function track(target, type, key) {
    if (!shouldTrack || activeEffect === void 0) {
      return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
      if (activeEffect.options.onTrack) {
        activeEffect.options.onTrack({
          effect: activeEffect,
          target,
          type,
          key
        });
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    const effects = /* @__PURE__ */ new Set();
    const add2 = (effectsToAdd) => {
      if (effectsToAdd) {
        effectsToAdd.forEach((effect3) => {
          if (effect3 !== activeEffect || effect3.allowRecurse) {
            effects.add(effect3);
          }
        });
      }
    };
    if (type === "clear") {
      depsMap.forEach(add2);
    } else if (key === "length" && isArray(target)) {
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 >= newValue) {
          add2(dep);
        }
      });
    } else {
      if (key !== void 0) {
        add2(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray(target)) {
            add2(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              add2(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            add2(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray(target)) {
            add2(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              add2(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            add2(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    const run = (effect3) => {
      if (effect3.options.onTrigger) {
        effect3.options.onTrigger({
          effect: effect3,
          target,
          key,
          type,
          newValue,
          oldValue,
          oldTarget
        });
      }
      if (effect3.options.scheduler) {
        effect3.options.scheduler(effect3);
      } else {
        effect3();
      }
    };
    effects.forEach(run);
  }
  var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
  var get2 = /* @__PURE__ */ createGetter();
  var shallowGet = /* @__PURE__ */ createGetter(false, true);
  var readonlyGet = /* @__PURE__ */ createGetter(true);
  var shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
  var arrayInstrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    const method = Array.prototype[key];
    arrayInstrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = method.apply(arr, args);
      if (res === -1 || res === false) {
        return method.apply(arr, args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    const method = Array.prototype[key];
    arrayInstrumentations[key] = function(...args) {
      pauseTracking();
      const res = method.apply(this, args);
      resetTracking();
      return res;
    };
  });
  function createGetter(isReadonly = false, shallow = false) {
    return function get3(target, key, receiver) {
      if (key === "__v_isReactive") {
        return !isReadonly;
      } else if (key === "__v_isReadonly") {
        return isReadonly;
      } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
        return shouldUnwrap ? res.value : res;
      }
      if (isObject(res)) {
        return isReadonly ? readonly(res) : reactive2(res);
      }
      return res;
    };
  }
  var set2 = /* @__PURE__ */ createSetter();
  var shallowSet = /* @__PURE__ */ createSetter(true);
  function createSetter(shallow = false) {
    return function set3(target, key, value, receiver) {
      let oldValue = target[key];
      if (!shallow) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    };
  }
  function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  function ownKeys(target) {
    track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }
  var mutableHandlers = {
    get: get2,
    set: set2,
    deleteProperty,
    has,
    ownKeys
  };
  var readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
      if (true) {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    },
    deleteProperty(target, key) {
      if (true) {
        console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    }
  };
  var shallowReactiveHandlers = extend({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
  });
  var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
  });
  var toReactive = (value) => isObject(value) ? reactive2(value) : value;
  var toReadonly = (value) => isObject(value) ? readonly(value) : value;
  var toShallow = (value) => value;
  var getProto = (v) => Reflect.getPrototypeOf(v);
  function get$1(target, key, isReadonly = false, isShallow = false) {
    target = target["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "get", key);
    }
    !isReadonly && track(rawTarget, "get", rawKey);
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has$1(key, isReadonly = false) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "has", key);
    }
    !isReadonly && track(rawTarget, "has", rawKey);
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly = false) {
    target = target["__v_raw"];
    !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get3 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else if (true) {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get3.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value, oldValue);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get3 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else if (true) {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get3 ? get3.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = true ? isMap(target) ? new Map(target) : new Set(target) : void 0;
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0, oldTarget);
    }
    return result;
  }
  function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly, isShallow) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
      return {
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      if (true) {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
      }
      return type === "delete" ? false : this;
    };
  }
  var mutableInstrumentations = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  var shallowInstrumentations = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  var readonlyInstrumentations = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  var shallowReadonlyInstrumentations = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  var iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true, false);
    shallowInstrumentations[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
  });
  function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly;
      } else if (key === "__v_isReadonly") {
        return isReadonly;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }
  var mutableCollectionHandlers = {
    get: createInstrumentationGetter(false, false)
  };
  var shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
  };
  var readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
  };
  var shallowReadonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, true)
  };
  function checkIdentityKeys(target, has2, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has2.call(target, rawKey)) {
      const type = toRawType(target);
      console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
    }
  }
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  var readonlyMap = /* @__PURE__ */ new WeakMap();
  var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive2(target) {
    if (target && target["__v_isReadonly"]) {
      return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }
  function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      if (true) {
        console.warn(`value cannot be made reactive: ${String(target)}`);
      }
      return target;
    }
    if (target["__v_raw"] && !(isReadonly && target["__v_isReactive"])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }
  function toRaw(observed) {
    return observed && toRaw(observed["__v_raw"]) || observed;
  }
  function isRef(r) {
    return Boolean(r && r.__v_isRef === true);
  }
  magic("nextTick", () => nextTick);
  magic("dispatch", (el) => dispatch.bind(dispatch, el));
  magic("watch", (el, { evaluateLater: evaluateLater2, effect: effect3 }) => (key, callback) => {
    let evaluate2 = evaluateLater2(key);
    let firstTime = true;
    let oldValue;
    let effectReference = effect3(() => evaluate2((value) => {
      JSON.stringify(value);
      if (!firstTime) {
        queueMicrotask(() => {
          callback(value, oldValue);
          oldValue = value;
        });
      } else {
        oldValue = value;
      }
      firstTime = false;
    }));
    el._x_effects.delete(effectReference);
  });
  magic("store", getStores);
  magic("data", (el) => scope(el));
  magic("root", (el) => closestRoot(el));
  magic("refs", (el) => {
    if (el._x_refs_proxy)
      return el._x_refs_proxy;
    el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
    return el._x_refs_proxy;
  });
  function getArrayOfRefObject(el) {
    let refObjects = [];
    let currentEl = el;
    while (currentEl) {
      if (currentEl._x_refs)
        refObjects.push(currentEl._x_refs);
      currentEl = currentEl.parentNode;
    }
    return refObjects;
  }
  var globalIdMemo = {};
  function findAndIncrementId(name) {
    if (!globalIdMemo[name])
      globalIdMemo[name] = 0;
    return ++globalIdMemo[name];
  }
  function closestIdRoot(el, name) {
    return findClosest(el, (element) => {
      if (element._x_ids && element._x_ids[name])
        return true;
    });
  }
  function setIdRoot(el, name) {
    if (!el._x_ids)
      el._x_ids = {};
    if (!el._x_ids[name])
      el._x_ids[name] = findAndIncrementId(name);
  }
  magic("id", (el) => (name, key = null) => {
    let root = closestIdRoot(el, name);
    let id = root ? root._x_ids[name] : findAndIncrementId(name);
    return key ? `${name}-${id}-${key}` : `${name}-${id}`;
  });
  magic("el", (el) => el);
  warnMissingPluginMagic("Focus", "focus", "focus");
  warnMissingPluginMagic("Persist", "persist", "persist");
  function warnMissingPluginMagic(name, magicName, slug) {
    magic(magicName, (el) => warn(`You can't use [$${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
  }
  directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let func = evaluateLater2(expression);
    let innerGet = () => {
      let result;
      func((i) => result = i);
      return result;
    };
    let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
    let innerSet = (val) => evaluateInnerSet(() => {
    }, { scope: { __placeholder: val } });
    let initialValue = innerGet();
    innerSet(initialValue);
    queueMicrotask(() => {
      if (!el._x_model)
        return;
      el._x_removeModelListeners["default"]();
      let outerGet = el._x_model.get;
      let outerSet = el._x_model.set;
      effect3(() => innerSet(outerGet()));
      effect3(() => outerSet(innerGet()));
    });
  });
  directive("teleport", (el, { expression }, { cleanup: cleanup2 }) => {
    if (el.tagName.toLowerCase() !== "template")
      warn("x-teleport can only be used on a <template> tag", el);
    let target = document.querySelector(expression);
    if (!target)
      warn(`Cannot find x-teleport element for selector: "${expression}"`);
    let clone2 = el.content.cloneNode(true).firstElementChild;
    el._x_teleport = clone2;
    clone2._x_teleportBack = el;
    if (el._x_forwardEvents) {
      el._x_forwardEvents.forEach((eventName) => {
        clone2.addEventListener(eventName, (e) => {
          e.stopPropagation();
          el.dispatchEvent(new e.constructor(e.type, e));
        });
      });
    }
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      target.appendChild(clone2);
      initTree(clone2);
      clone2._x_ignore = true;
    });
    cleanup2(() => clone2.remove());
  });
  var handler = () => {
  };
  handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
    modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
    cleanup2(() => {
      modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
    });
  };
  directive("ignore", handler);
  directive("effect", (el, { expression }, { effect: effect3 }) => effect3(evaluateLater(el, expression)));
  function on(el, event, modifiers, callback) {
    let listenerTarget = el;
    let handler3 = (e) => callback(e);
    let options = {};
    let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
    if (modifiers.includes("dot"))
      event = dotSyntax(event);
    if (modifiers.includes("camel"))
      event = camelCase2(event);
    if (modifiers.includes("passive"))
      options.passive = true;
    if (modifiers.includes("capture"))
      options.capture = true;
    if (modifiers.includes("window"))
      listenerTarget = window;
    if (modifiers.includes("document"))
      listenerTarget = document;
    if (modifiers.includes("prevent"))
      handler3 = wrapHandler(handler3, (next, e) => {
        e.preventDefault();
        next(e);
      });
    if (modifiers.includes("stop"))
      handler3 = wrapHandler(handler3, (next, e) => {
        e.stopPropagation();
        next(e);
      });
    if (modifiers.includes("self"))
      handler3 = wrapHandler(handler3, (next, e) => {
        e.target === el && next(e);
      });
    if (modifiers.includes("away") || modifiers.includes("outside")) {
      listenerTarget = document;
      handler3 = wrapHandler(handler3, (next, e) => {
        if (el.contains(e.target))
          return;
        if (e.target.isConnected === false)
          return;
        if (el.offsetWidth < 1 && el.offsetHeight < 1)
          return;
        if (el._x_isShown === false)
          return;
        next(e);
      });
    }
    if (modifiers.includes("once")) {
      handler3 = wrapHandler(handler3, (next, e) => {
        next(e);
        listenerTarget.removeEventListener(event, handler3, options);
      });
    }
    handler3 = wrapHandler(handler3, (next, e) => {
      if (isKeyEvent(event)) {
        if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
          return;
        }
      }
      next(e);
    });
    if (modifiers.includes("debounce")) {
      let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
      let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
      handler3 = debounce(handler3, wait);
    }
    if (modifiers.includes("throttle")) {
      let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
      let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
      handler3 = throttle(handler3, wait);
    }
    listenerTarget.addEventListener(event, handler3, options);
    return () => {
      listenerTarget.removeEventListener(event, handler3, options);
    };
  }
  function dotSyntax(subject) {
    return subject.replace(/-/g, ".");
  }
  function camelCase2(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function isNumeric(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function kebabCase2(subject) {
    return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
  }
  function isKeyEvent(event) {
    return ["keydown", "keyup"].includes(event);
  }
  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter((i) => {
      return !["window", "document", "prevent", "stop", "once"].includes(i);
    });
    if (keyModifiers.includes("debounce")) {
      let debounceIndex = keyModifiers.indexOf("debounce");
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
    }
    if (keyModifiers.length === 0)
      return false;
    if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
      return false;
    const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
        if (modifier === "cmd" || modifier === "super")
          modifier = "meta";
        return e[`${modifier}Key`];
      });
      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        if (keyToModifiers(e.key).includes(keyModifiers[0]))
          return false;
      }
    }
    return true;
  }
  function keyToModifiers(key) {
    if (!key)
      return [];
    key = kebabCase2(key);
    let modifierToKeyMap = {
      ctrl: "control",
      slash: "/",
      space: "-",
      spacebar: "-",
      cmd: "meta",
      esc: "escape",
      up: "arrow-up",
      down: "arrow-down",
      left: "arrow-left",
      right: "arrow-right",
      period: ".",
      equal: "="
    };
    modifierToKeyMap[key] = key;
    return Object.keys(modifierToKeyMap).map((modifier) => {
      if (modifierToKeyMap[modifier] === key)
        return modifier;
    }).filter((modifier) => modifier);
  }
  directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
    let evaluate2 = evaluateLater(el, expression);
    let assignmentExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
    let evaluateAssignment = evaluateLater(el, assignmentExpression);
    var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
    let assigmentFunction = generateAssignmentFunction(el, modifiers, expression);
    let removeListener = on(el, event, modifiers, (e) => {
      evaluateAssignment(() => {
      }, { scope: {
        $event: e,
        rightSideOfExpression: assigmentFunction
      } });
    });
    if (!el._x_removeModelListeners)
      el._x_removeModelListeners = {};
    el._x_removeModelListeners["default"] = removeListener;
    cleanup2(() => el._x_removeModelListeners["default"]());
    let evaluateSetModel = evaluateLater(el, `${expression} = __placeholder`);
    el._x_model = {
      get() {
        let result;
        evaluate2((value) => result = value);
        return result;
      },
      set(value) {
        evaluateSetModel(() => {
        }, { scope: { __placeholder: value } });
      }
    };
    el._x_forceModelUpdate = () => {
      evaluate2((value) => {
        if (value === void 0 && expression.match(/\./))
          value = "";
        window.fromModel = true;
        mutateDom(() => bind(el, "value", value));
        delete window.fromModel;
      });
    };
    effect3(() => {
      if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
        return;
      el._x_forceModelUpdate();
    });
  });
  function generateAssignmentFunction(el, modifiers, expression) {
    if (el.type === "radio") {
      mutateDom(() => {
        if (!el.hasAttribute("name"))
          el.setAttribute("name", expression);
      });
    }
    return (event, currentValue) => {
      return mutateDom(() => {
        if (event instanceof CustomEvent && event.detail !== void 0) {
          return event.detail || event.target.value;
        } else if (el.type === "checkbox") {
          if (Array.isArray(currentValue)) {
            let newValue = modifiers.includes("number") ? safeParseNumber(event.target.value) : event.target.value;
            return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
          } else {
            return event.target.checked;
          }
        } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
          return modifiers.includes("number") ? Array.from(event.target.selectedOptions).map((option) => {
            let rawValue = option.value || option.text;
            return safeParseNumber(rawValue);
          }) : Array.from(event.target.selectedOptions).map((option) => {
            return option.value || option.text;
          });
        } else {
          let rawValue = event.target.value;
          return modifiers.includes("number") ? safeParseNumber(rawValue) : modifiers.includes("trim") ? rawValue.trim() : rawValue;
        }
      });
    };
  }
  function safeParseNumber(rawValue) {
    let number = rawValue ? parseFloat(rawValue) : null;
    return isNumeric2(number) ? number : rawValue;
  }
  function checkedAttrLooseCompare2(valueA, valueB) {
    return valueA == valueB;
  }
  function isNumeric2(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));
  addInitSelector(() => `[${prefix("init")}]`);
  directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
    if (typeof expression === "string") {
      return !!expression.trim() && evaluate2(expression, {}, false);
    }
    return evaluate2(expression, {}, false);
  }));
  directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let evaluate2 = evaluateLater2(expression);
    effect3(() => {
      evaluate2((value) => {
        mutateDom(() => {
          el.textContent = value;
        });
      });
    });
  });
  directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let evaluate2 = evaluateLater2(expression);
    effect3(() => {
      evaluate2((value) => {
        mutateDom(() => {
          el.innerHTML = value;
          el._x_ignoreSelf = true;
          initTree(el);
          delete el._x_ignoreSelf;
        });
      });
    });
  });
  mapAttributes(startingWith(":", into(prefix("bind:"))));
  directive("bind", (el, { value, modifiers, expression, original }, { effect: effect3 }) => {
    if (!value) {
      let bindingProviders = {};
      injectBindingProviders(bindingProviders);
      let getBindings = evaluateLater(el, expression);
      getBindings((bindings) => {
        applyBindingsObject(el, bindings, original);
      }, { scope: bindingProviders });
      return;
    }
    if (value === "key")
      return storeKeyForXFor(el, expression);
    let evaluate2 = evaluateLater(el, expression);
    effect3(() => evaluate2((result) => {
      if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
        result = "";
      }
      mutateDom(() => bind(el, value, result, modifiers));
    }));
  });
  function storeKeyForXFor(el, expression) {
    el._x_keyExpression = expression;
  }
  addRootSelector(() => `[${prefix("data")}]`);
  directive("data", skipDuringClone((el, { expression }, { cleanup: cleanup2 }) => {
    expression = expression === "" ? "{}" : expression;
    let magicContext = {};
    injectMagics(magicContext, el);
    let dataProviderContext = {};
    injectDataProviders(dataProviderContext, magicContext);
    let data2 = evaluate(el, expression, { scope: dataProviderContext });
    if (data2 === void 0)
      data2 = {};
    injectMagics(data2, el);
    let reactiveData = reactive(data2);
    initInterceptors(reactiveData);
    let undo = addScopeToNode(el, reactiveData);
    reactiveData["init"] && evaluate(el, reactiveData["init"]);
    cleanup2(() => {
      reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
      undo();
    });
  }));
  directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
    let evaluate2 = evaluateLater(el, expression);
    if (!el._x_doHide)
      el._x_doHide = () => {
        mutateDom(() => {
          el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
        });
      };
    if (!el._x_doShow)
      el._x_doShow = () => {
        mutateDom(() => {
          if (el.style.length === 1 && el.style.display === "none") {
            el.removeAttribute("style");
          } else {
            el.style.removeProperty("display");
          }
        });
      };
    let hide = () => {
      el._x_doHide();
      el._x_isShown = false;
    };
    let show = () => {
      el._x_doShow();
      el._x_isShown = true;
    };
    let clickAwayCompatibleShow = () => setTimeout(show);
    let toggle = once((value) => value ? show() : hide(), (value) => {
      if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
        el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
      } else {
        value ? clickAwayCompatibleShow() : hide();
      }
    });
    let oldValue;
    let firstTime = true;
    effect3(() => evaluate2((value) => {
      if (!firstTime && value === oldValue)
        return;
      if (modifiers.includes("immediate"))
        value ? clickAwayCompatibleShow() : hide();
      toggle(value);
      oldValue = value;
      firstTime = false;
    }));
  });
  directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
    let iteratorNames = parseForExpression(expression);
    let evaluateItems = evaluateLater(el, iteratorNames.items);
    let evaluateKey = evaluateLater(el, el._x_keyExpression || "index");
    el._x_prevKeys = [];
    el._x_lookup = {};
    effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
    cleanup2(() => {
      Object.values(el._x_lookup).forEach((el2) => el2.remove());
      delete el._x_prevKeys;
      delete el._x_lookup;
    });
  });
  function loop(el, iteratorNames, evaluateItems, evaluateKey) {
    let isObject2 = (i) => typeof i === "object" && !Array.isArray(i);
    let templateEl = el;
    evaluateItems((items) => {
      if (isNumeric3(items) && items >= 0) {
        items = Array.from(Array(items).keys(), (i) => i + 1);
      }
      if (items === void 0)
        items = [];
      let lookup = el._x_lookup;
      let prevKeys = el._x_prevKeys;
      let scopes = [];
      let keys = [];
      if (isObject2(items)) {
        items = Object.entries(items).map(([key, value]) => {
          let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
          evaluateKey((value2) => keys.push(value2), { scope: { index: key, ...scope2 } });
          scopes.push(scope2);
        });
      } else {
        for (let i = 0; i < items.length; i++) {
          let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
          evaluateKey((value) => keys.push(value), { scope: { index: i, ...scope2 } });
          scopes.push(scope2);
        }
      }
      let adds = [];
      let moves = [];
      let removes = [];
      let sames = [];
      for (let i = 0; i < prevKeys.length; i++) {
        let key = prevKeys[i];
        if (keys.indexOf(key) === -1)
          removes.push(key);
      }
      prevKeys = prevKeys.filter((key) => !removes.includes(key));
      let lastKey = "template";
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let prevIndex = prevKeys.indexOf(key);
        if (prevIndex === -1) {
          prevKeys.splice(i, 0, key);
          adds.push([lastKey, i]);
        } else if (prevIndex !== i) {
          let keyInSpot = prevKeys.splice(i, 1)[0];
          let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
          prevKeys.splice(i, 0, keyForSpot);
          prevKeys.splice(prevIndex, 0, keyInSpot);
          moves.push([keyInSpot, keyForSpot]);
        } else {
          sames.push(key);
        }
        lastKey = key;
      }
      for (let i = 0; i < removes.length; i++) {
        let key = removes[i];
        if (!!lookup[key]._x_effects) {
          lookup[key]._x_effects.forEach(dequeueJob);
        }
        lookup[key].remove();
        lookup[key] = null;
        delete lookup[key];
      }
      for (let i = 0; i < moves.length; i++) {
        let [keyInSpot, keyForSpot] = moves[i];
        let elInSpot = lookup[keyInSpot];
        let elForSpot = lookup[keyForSpot];
        let marker = document.createElement("div");
        mutateDom(() => {
          elForSpot.after(marker);
          elInSpot.after(elForSpot);
          elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
          marker.before(elInSpot);
          elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
          marker.remove();
        });
        refreshScope(elForSpot, scopes[keys.indexOf(keyForSpot)]);
      }
      for (let i = 0; i < adds.length; i++) {
        let [lastKey2, index] = adds[i];
        let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
        if (lastEl._x_currentIfEl)
          lastEl = lastEl._x_currentIfEl;
        let scope2 = scopes[index];
        let key = keys[index];
        let clone2 = document.importNode(templateEl.content, true).firstElementChild;
        addScopeToNode(clone2, reactive(scope2), templateEl);
        mutateDom(() => {
          lastEl.after(clone2);
          initTree(clone2);
        });
        if (typeof key === "object") {
          warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
        }
        lookup[key] = clone2;
      }
      for (let i = 0; i < sames.length; i++) {
        refreshScope(lookup[sames[i]], scopes[keys.indexOf(sames[i])]);
      }
      templateEl._x_prevKeys = keys;
    });
  }
  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\s*\(|\)\s*$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = expression.match(forAliasRE);
    if (!inMatch)
      return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].replace(stripParensRE, "").trim();
    let iteratorMatch = item.match(forIteratorRE);
    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, "").trim();
      res.index = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }
    return res;
  }
  function getIterationScopeVariables(iteratorNames, item, index, items) {
    let scopeVariables = {};
    if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
      let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
      names.forEach((name, i) => {
        scopeVariables[name] = item[i];
      });
    } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
      let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
      names.forEach((name) => {
        scopeVariables[name] = item[name];
      });
    } else {
      scopeVariables[iteratorNames.item] = item;
    }
    if (iteratorNames.index)
      scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection)
      scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }
  function isNumeric3(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function handler2() {
  }
  handler2.inline = (el, { expression }, { cleanup: cleanup2 }) => {
    let root = closestRoot(el);
    if (!root._x_refs)
      root._x_refs = {};
    root._x_refs[expression] = el;
    cleanup2(() => delete root._x_refs[expression]);
  };
  directive("ref", handler2);
  directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
    let evaluate2 = evaluateLater(el, expression);
    let show = () => {
      if (el._x_currentIfEl)
        return el._x_currentIfEl;
      let clone2 = el.content.cloneNode(true).firstElementChild;
      addScopeToNode(clone2, {}, el);
      mutateDom(() => {
        el.after(clone2);
        initTree(clone2);
      });
      el._x_currentIfEl = clone2;
      el._x_undoIf = () => {
        walk(clone2, (node) => {
          if (!!node._x_effects) {
            node._x_effects.forEach(dequeueJob);
          }
        });
        clone2.remove();
        delete el._x_currentIfEl;
      };
      return clone2;
    };
    let hide = () => {
      if (!el._x_undoIf)
        return;
      el._x_undoIf();
      delete el._x_undoIf;
    };
    effect3(() => evaluate2((value) => {
      value ? show() : hide();
    }));
    cleanup2(() => el._x_undoIf && el._x_undoIf());
  });
  directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
    let names = evaluate2(expression);
    names.forEach((name) => setIdRoot(el, name));
  });
  mapAttributes(startingWith("@", into(prefix("on:"))));
  directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
    let evaluate2 = expression ? evaluateLater(el, expression) : () => {
    };
    if (el.tagName.toLowerCase() === "template") {
      if (!el._x_forwardEvents)
        el._x_forwardEvents = [];
      if (!el._x_forwardEvents.includes(value))
        el._x_forwardEvents.push(value);
    }
    let removeListener = on(el, value, modifiers, (e) => {
      evaluate2(() => {
      }, { scope: { $event: e }, params: [e] });
    });
    cleanup2(() => removeListener());
  }));
  warnMissingPluginDirective("Collapse", "collapse", "collapse");
  warnMissingPluginDirective("Intersect", "intersect", "intersect");
  warnMissingPluginDirective("Focus", "trap", "focus");
  warnMissingPluginDirective("Mask", "mask", "mask");
  function warnMissingPluginDirective(name, directiveName2, slug) {
    directive(directiveName2, (el) => warn(`You can't use [x-${directiveName2}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
  }
  alpine_default.setEvaluator(normalEvaluator);
  alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
  var src_default = alpine_default;
  var module_default = src_default;

  // Shared (Extension)/Resources/experimental/experimental.js
  var FEATURES = [
    [
      "delegation",
      "NIP-26 Delegation Profiles",
      "Allow user to create delegated profiles that obey the NIP-26 standard. Requires client support."
    ]
  ];
  module_default.data("experimental", () => ({
    features: [],
    async init() {
      await this.reloadFeatures();
      console.log(this.features);
    },
    async reloadFeatures() {
      this.features = await Promise.all(
        FEATURES.map(async ([name, shortDesc, longDesc]) => {
          name = `feature:${name}`;
          let active = await browser.storage.local.get({
            [name]: false
          });
          active = active[name];
          return [name, active, shortDesc, longDesc];
        })
      );
    },
    async change(feature, active) {
      console.log(feature, active);
      await browser.storage.local.set({ [feature]: active });
      await this.reloadFeatures();
    }
  }));
  module_default.start();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FscGluZWpzL2Rpc3QvbW9kdWxlLmVzbS5qcyIsICJleHBlcmltZW50YWwuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9zY2hlZHVsZXIuanNcbnZhciBmbHVzaFBlbmRpbmcgPSBmYWxzZTtcbnZhciBmbHVzaGluZyA9IGZhbHNlO1xudmFyIHF1ZXVlID0gW107XG5mdW5jdGlvbiBzY2hlZHVsZXIoY2FsbGJhY2spIHtcbiAgcXVldWVKb2IoY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gcXVldWVKb2Ioam9iKSB7XG4gIGlmICghcXVldWUuaW5jbHVkZXMoam9iKSlcbiAgICBxdWV1ZS5wdXNoKGpvYik7XG4gIHF1ZXVlRmx1c2goKTtcbn1cbmZ1bmN0aW9uIGRlcXVldWVKb2Ioam9iKSB7XG4gIGxldCBpbmRleCA9IHF1ZXVlLmluZGV4T2Yoam9iKTtcbiAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICBxdWV1ZS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuZnVuY3Rpb24gcXVldWVGbHVzaCgpIHtcbiAgaWYgKCFmbHVzaGluZyAmJiAhZmx1c2hQZW5kaW5nKSB7XG4gICAgZmx1c2hQZW5kaW5nID0gdHJ1ZTtcbiAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaEpvYnMpO1xuICB9XG59XG5mdW5jdGlvbiBmbHVzaEpvYnMoKSB7XG4gIGZsdXNoUGVuZGluZyA9IGZhbHNlO1xuICBmbHVzaGluZyA9IHRydWU7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBxdWV1ZVtpXSgpO1xuICB9XG4gIHF1ZXVlLmxlbmd0aCA9IDA7XG4gIGZsdXNoaW5nID0gZmFsc2U7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9yZWFjdGl2aXR5LmpzXG52YXIgcmVhY3RpdmU7XG52YXIgZWZmZWN0O1xudmFyIHJlbGVhc2U7XG52YXIgcmF3O1xudmFyIHNob3VsZFNjaGVkdWxlID0gdHJ1ZTtcbmZ1bmN0aW9uIGRpc2FibGVFZmZlY3RTY2hlZHVsaW5nKGNhbGxiYWNrKSB7XG4gIHNob3VsZFNjaGVkdWxlID0gZmFsc2U7XG4gIGNhbGxiYWNrKCk7XG4gIHNob3VsZFNjaGVkdWxlID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHNldFJlYWN0aXZpdHlFbmdpbmUoZW5naW5lKSB7XG4gIHJlYWN0aXZlID0gZW5naW5lLnJlYWN0aXZlO1xuICByZWxlYXNlID0gZW5naW5lLnJlbGVhc2U7XG4gIGVmZmVjdCA9IChjYWxsYmFjaykgPT4gZW5naW5lLmVmZmVjdChjYWxsYmFjaywge3NjaGVkdWxlcjogKHRhc2spID0+IHtcbiAgICBpZiAoc2hvdWxkU2NoZWR1bGUpIHtcbiAgICAgIHNjaGVkdWxlcih0YXNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFzaygpO1xuICAgIH1cbiAgfX0pO1xuICByYXcgPSBlbmdpbmUucmF3O1xufVxuZnVuY3Rpb24gb3ZlcnJpZGVFZmZlY3Qob3ZlcnJpZGUpIHtcbiAgZWZmZWN0ID0gb3ZlcnJpZGU7XG59XG5mdW5jdGlvbiBlbGVtZW50Qm91bmRFZmZlY3QoZWwpIHtcbiAgbGV0IGNsZWFudXAyID0gKCkgPT4ge1xuICB9O1xuICBsZXQgd3JhcHBlZEVmZmVjdCA9IChjYWxsYmFjaykgPT4ge1xuICAgIGxldCBlZmZlY3RSZWZlcmVuY2UgPSBlZmZlY3QoY2FsbGJhY2spO1xuICAgIGlmICghZWwuX3hfZWZmZWN0cykge1xuICAgICAgZWwuX3hfZWZmZWN0cyA9IG5ldyBTZXQoKTtcbiAgICAgIGVsLl94X3J1bkVmZmVjdHMgPSAoKSA9PiB7XG4gICAgICAgIGVsLl94X2VmZmVjdHMuZm9yRWFjaCgoaSkgPT4gaSgpKTtcbiAgICAgIH07XG4gICAgfVxuICAgIGVsLl94X2VmZmVjdHMuYWRkKGVmZmVjdFJlZmVyZW5jZSk7XG4gICAgY2xlYW51cDIgPSAoKSA9PiB7XG4gICAgICBpZiAoZWZmZWN0UmVmZXJlbmNlID09PSB2b2lkIDApXG4gICAgICAgIHJldHVybjtcbiAgICAgIGVsLl94X2VmZmVjdHMuZGVsZXRlKGVmZmVjdFJlZmVyZW5jZSk7XG4gICAgICByZWxlYXNlKGVmZmVjdFJlZmVyZW5jZSk7XG4gICAgfTtcbiAgICByZXR1cm4gZWZmZWN0UmVmZXJlbmNlO1xuICB9O1xuICByZXR1cm4gW3dyYXBwZWRFZmZlY3QsICgpID0+IHtcbiAgICBjbGVhbnVwMigpO1xuICB9XTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL211dGF0aW9uLmpzXG52YXIgb25BdHRyaWJ1dGVBZGRlZHMgPSBbXTtcbnZhciBvbkVsUmVtb3ZlZHMgPSBbXTtcbnZhciBvbkVsQWRkZWRzID0gW107XG5mdW5jdGlvbiBvbkVsQWRkZWQoY2FsbGJhY2spIHtcbiAgb25FbEFkZGVkcy5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIG9uRWxSZW1vdmVkKGVsLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpZiAoIWVsLl94X2NsZWFudXBzKVxuICAgICAgZWwuX3hfY2xlYW51cHMgPSBbXTtcbiAgICBlbC5feF9jbGVhbnVwcy5wdXNoKGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjayA9IGVsO1xuICAgIG9uRWxSZW1vdmVkcy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxufVxuZnVuY3Rpb24gb25BdHRyaWJ1dGVzQWRkZWQoY2FsbGJhY2spIHtcbiAgb25BdHRyaWJ1dGVBZGRlZHMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBvbkF0dHJpYnV0ZVJlbW92ZWQoZWwsIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMpXG4gICAgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMgPSB7fTtcbiAgaWYgKCFlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXSlcbiAgICBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXSA9IFtdO1xuICBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXS5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGNsZWFudXBBdHRyaWJ1dGVzKGVsLCBuYW1lcykge1xuICBpZiAoIWVsLl94X2F0dHJpYnV0ZUNsZWFudXBzKVxuICAgIHJldHVybjtcbiAgT2JqZWN0LmVudHJpZXMoZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMpLmZvckVhY2goKFtuYW1lLCB2YWx1ZV0pID0+IHtcbiAgICBpZiAobmFtZXMgPT09IHZvaWQgMCB8fCBuYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgdmFsdWUuZm9yRWFjaCgoaSkgPT4gaSgpKTtcbiAgICAgIGRlbGV0ZSBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufVxudmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIob25NdXRhdGUpO1xudmFyIGN1cnJlbnRseU9ic2VydmluZyA9IGZhbHNlO1xuZnVuY3Rpb24gc3RhcnRPYnNlcnZpbmdNdXRhdGlvbnMoKSB7XG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtzdWJ0cmVlOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUsIGF0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlfSk7XG4gIGN1cnJlbnRseU9ic2VydmluZyA9IHRydWU7XG59XG5mdW5jdGlvbiBzdG9wT2JzZXJ2aW5nTXV0YXRpb25zKCkge1xuICBmbHVzaE9ic2VydmVyKCk7XG4gIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgY3VycmVudGx5T2JzZXJ2aW5nID0gZmFsc2U7XG59XG52YXIgcmVjb3JkUXVldWUgPSBbXTtcbnZhciB3aWxsUHJvY2Vzc1JlY29yZFF1ZXVlID0gZmFsc2U7XG5mdW5jdGlvbiBmbHVzaE9ic2VydmVyKCkge1xuICByZWNvcmRRdWV1ZSA9IHJlY29yZFF1ZXVlLmNvbmNhdChvYnNlcnZlci50YWtlUmVjb3JkcygpKTtcbiAgaWYgKHJlY29yZFF1ZXVlLmxlbmd0aCAmJiAhd2lsbFByb2Nlc3NSZWNvcmRRdWV1ZSkge1xuICAgIHdpbGxQcm9jZXNzUmVjb3JkUXVldWUgPSB0cnVlO1xuICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICAgIHByb2Nlc3NSZWNvcmRRdWV1ZSgpO1xuICAgICAgd2lsbFByb2Nlc3NSZWNvcmRRdWV1ZSA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5mdW5jdGlvbiBwcm9jZXNzUmVjb3JkUXVldWUoKSB7XG4gIG9uTXV0YXRlKHJlY29yZFF1ZXVlKTtcbiAgcmVjb3JkUXVldWUubGVuZ3RoID0gMDtcbn1cbmZ1bmN0aW9uIG11dGF0ZURvbShjYWxsYmFjaykge1xuICBpZiAoIWN1cnJlbnRseU9ic2VydmluZylcbiAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgc3RvcE9ic2VydmluZ011dGF0aW9ucygpO1xuICBsZXQgcmVzdWx0ID0gY2FsbGJhY2soKTtcbiAgc3RhcnRPYnNlcnZpbmdNdXRhdGlvbnMoKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbnZhciBpc0NvbGxlY3RpbmcgPSBmYWxzZTtcbnZhciBkZWZlcnJlZE11dGF0aW9ucyA9IFtdO1xuZnVuY3Rpb24gZGVmZXJNdXRhdGlvbnMoKSB7XG4gIGlzQ29sbGVjdGluZyA9IHRydWU7XG59XG5mdW5jdGlvbiBmbHVzaEFuZFN0b3BEZWZlcnJpbmdNdXRhdGlvbnMoKSB7XG4gIGlzQ29sbGVjdGluZyA9IGZhbHNlO1xuICBvbk11dGF0ZShkZWZlcnJlZE11dGF0aW9ucyk7XG4gIGRlZmVycmVkTXV0YXRpb25zID0gW107XG59XG5mdW5jdGlvbiBvbk11dGF0ZShtdXRhdGlvbnMpIHtcbiAgaWYgKGlzQ29sbGVjdGluZykge1xuICAgIGRlZmVycmVkTXV0YXRpb25zID0gZGVmZXJyZWRNdXRhdGlvbnMuY29uY2F0KG11dGF0aW9ucyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBhZGRlZE5vZGVzID0gW107XG4gIGxldCByZW1vdmVkTm9kZXMgPSBbXTtcbiAgbGV0IGFkZGVkQXR0cmlidXRlcyA9IG5ldyBNYXAoKTtcbiAgbGV0IHJlbW92ZWRBdHRyaWJ1dGVzID0gbmV3IE1hcCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtdXRhdGlvbnNbaV0udGFyZ2V0Ll94X2lnbm9yZU11dGF0aW9uT2JzZXJ2ZXIpXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAobXV0YXRpb25zW2ldLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgIG11dGF0aW9uc1tpXS5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IG5vZGUubm9kZVR5cGUgPT09IDEgJiYgYWRkZWROb2Rlcy5wdXNoKG5vZGUpKTtcbiAgICAgIG11dGF0aW9uc1tpXS5yZW1vdmVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4gbm9kZS5ub2RlVHlwZSA9PT0gMSAmJiByZW1vdmVkTm9kZXMucHVzaChub2RlKSk7XG4gICAgfVxuICAgIGlmIChtdXRhdGlvbnNbaV0udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIpIHtcbiAgICAgIGxldCBlbCA9IG11dGF0aW9uc1tpXS50YXJnZXQ7XG4gICAgICBsZXQgbmFtZSA9IG11dGF0aW9uc1tpXS5hdHRyaWJ1dGVOYW1lO1xuICAgICAgbGV0IG9sZFZhbHVlID0gbXV0YXRpb25zW2ldLm9sZFZhbHVlO1xuICAgICAgbGV0IGFkZDIgPSAoKSA9PiB7XG4gICAgICAgIGlmICghYWRkZWRBdHRyaWJ1dGVzLmhhcyhlbCkpXG4gICAgICAgICAgYWRkZWRBdHRyaWJ1dGVzLnNldChlbCwgW10pO1xuICAgICAgICBhZGRlZEF0dHJpYnV0ZXMuZ2V0KGVsKS5wdXNoKHtuYW1lLCB2YWx1ZTogZWwuZ2V0QXR0cmlidXRlKG5hbWUpfSk7XG4gICAgICB9O1xuICAgICAgbGV0IHJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFyZW1vdmVkQXR0cmlidXRlcy5oYXMoZWwpKVxuICAgICAgICAgIHJlbW92ZWRBdHRyaWJ1dGVzLnNldChlbCwgW10pO1xuICAgICAgICByZW1vdmVkQXR0cmlidXRlcy5nZXQoZWwpLnB1c2gobmFtZSk7XG4gICAgICB9O1xuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZShuYW1lKSAmJiBvbGRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICBhZGQyKCk7XG4gICAgICB9IGVsc2UgaWYgKGVsLmhhc0F0dHJpYnV0ZShuYW1lKSkge1xuICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgYWRkMigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJlbW92ZWRBdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJzLCBlbCkgPT4ge1xuICAgIGNsZWFudXBBdHRyaWJ1dGVzKGVsLCBhdHRycyk7XG4gIH0pO1xuICBhZGRlZEF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cnMsIGVsKSA9PiB7XG4gICAgb25BdHRyaWJ1dGVBZGRlZHMuZm9yRWFjaCgoaSkgPT4gaShlbCwgYXR0cnMpKTtcbiAgfSk7XG4gIGZvciAobGV0IG5vZGUgb2YgcmVtb3ZlZE5vZGVzKSB7XG4gICAgaWYgKGFkZGVkTm9kZXMuaW5jbHVkZXMobm9kZSkpXG4gICAgICBjb250aW51ZTtcbiAgICBvbkVsUmVtb3ZlZHMuZm9yRWFjaCgoaSkgPT4gaShub2RlKSk7XG4gICAgaWYgKG5vZGUuX3hfY2xlYW51cHMpIHtcbiAgICAgIHdoaWxlIChub2RlLl94X2NsZWFudXBzLmxlbmd0aClcbiAgICAgICAgbm9kZS5feF9jbGVhbnVwcy5wb3AoKSgpO1xuICAgIH1cbiAgfVxuICBhZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICBub2RlLl94X2lnbm9yZVNlbGYgPSB0cnVlO1xuICAgIG5vZGUuX3hfaWdub3JlID0gdHJ1ZTtcbiAgfSk7XG4gIGZvciAobGV0IG5vZGUgb2YgYWRkZWROb2Rlcykge1xuICAgIGlmIChyZW1vdmVkTm9kZXMuaW5jbHVkZXMobm9kZSkpXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAoIW5vZGUuaXNDb25uZWN0ZWQpXG4gICAgICBjb250aW51ZTtcbiAgICBkZWxldGUgbm9kZS5feF9pZ25vcmVTZWxmO1xuICAgIGRlbGV0ZSBub2RlLl94X2lnbm9yZTtcbiAgICBvbkVsQWRkZWRzLmZvckVhY2goKGkpID0+IGkobm9kZSkpO1xuICAgIG5vZGUuX3hfaWdub3JlID0gdHJ1ZTtcbiAgICBub2RlLl94X2lnbm9yZVNlbGYgPSB0cnVlO1xuICB9XG4gIGFkZGVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGRlbGV0ZSBub2RlLl94X2lnbm9yZVNlbGY7XG4gICAgZGVsZXRlIG5vZGUuX3hfaWdub3JlO1xuICB9KTtcbiAgYWRkZWROb2RlcyA9IG51bGw7XG4gIHJlbW92ZWROb2RlcyA9IG51bGw7XG4gIGFkZGVkQXR0cmlidXRlcyA9IG51bGw7XG4gIHJlbW92ZWRBdHRyaWJ1dGVzID0gbnVsbDtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3Njb3BlLmpzXG5mdW5jdGlvbiBzY29wZShub2RlKSB7XG4gIHJldHVybiBtZXJnZVByb3hpZXMoY2xvc2VzdERhdGFTdGFjayhub2RlKSk7XG59XG5mdW5jdGlvbiBhZGRTY29wZVRvTm9kZShub2RlLCBkYXRhMiwgcmVmZXJlbmNlTm9kZSkge1xuICBub2RlLl94X2RhdGFTdGFjayA9IFtkYXRhMiwgLi4uY2xvc2VzdERhdGFTdGFjayhyZWZlcmVuY2VOb2RlIHx8IG5vZGUpXTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBub2RlLl94X2RhdGFTdGFjayA9IG5vZGUuX3hfZGF0YVN0YWNrLmZpbHRlcigoaSkgPT4gaSAhPT0gZGF0YTIpO1xuICB9O1xufVxuZnVuY3Rpb24gcmVmcmVzaFNjb3BlKGVsZW1lbnQsIHNjb3BlMikge1xuICBsZXQgZXhpc3RpbmdTY29wZSA9IGVsZW1lbnQuX3hfZGF0YVN0YWNrWzBdO1xuICBPYmplY3QuZW50cmllcyhzY29wZTIpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGV4aXN0aW5nU2NvcGVba2V5XSA9IHZhbHVlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGNsb3Nlc3REYXRhU3RhY2sobm9kZSkge1xuICBpZiAobm9kZS5feF9kYXRhU3RhY2spXG4gICAgcmV0dXJuIG5vZGUuX3hfZGF0YVN0YWNrO1xuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPT09IFwiZnVuY3Rpb25cIiAmJiBub2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgIHJldHVybiBjbG9zZXN0RGF0YVN0YWNrKG5vZGUuaG9zdCk7XG4gIH1cbiAgaWYgKCFub2RlLnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIGNsb3Nlc3REYXRhU3RhY2sobm9kZS5wYXJlbnROb2RlKTtcbn1cbmZ1bmN0aW9uIG1lcmdlUHJveGllcyhvYmplY3RzKSB7XG4gIGxldCB0aGlzUHJveHkgPSBuZXcgUHJveHkoe30sIHtcbiAgICBvd25LZXlzOiAoKSA9PiB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KG9iamVjdHMuZmxhdE1hcCgoaSkgPT4gT2JqZWN0LmtleXMoaSkpKSk7XG4gICAgfSxcbiAgICBoYXM6ICh0YXJnZXQsIG5hbWUpID0+IHtcbiAgICAgIHJldHVybiBvYmplY3RzLnNvbWUoKG9iaikgPT4gb2JqLmhhc093blByb3BlcnR5KG5hbWUpKTtcbiAgICB9LFxuICAgIGdldDogKHRhcmdldCwgbmFtZSkgPT4ge1xuICAgICAgcmV0dXJuIChvYmplY3RzLmZpbmQoKG9iaikgPT4ge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSk7XG4gICAgICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0ICYmIGRlc2NyaXB0b3IuZ2V0Ll94X2FscmVhZHlCb3VuZCB8fCBkZXNjcmlwdG9yLnNldCAmJiBkZXNjcmlwdG9yLnNldC5feF9hbHJlYWR5Qm91bmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKGRlc2NyaXB0b3IuZ2V0IHx8IGRlc2NyaXB0b3Iuc2V0KSAmJiBkZXNjcmlwdG9yLmVudW1lcmFibGUpIHtcbiAgICAgICAgICAgIGxldCBnZXR0ZXIgPSBkZXNjcmlwdG9yLmdldDtcbiAgICAgICAgICAgIGxldCBzZXR0ZXIgPSBkZXNjcmlwdG9yLnNldDtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0eSA9IGRlc2NyaXB0b3I7XG4gICAgICAgICAgICBnZXR0ZXIgPSBnZXR0ZXIgJiYgZ2V0dGVyLmJpbmQodGhpc1Byb3h5KTtcbiAgICAgICAgICAgIHNldHRlciA9IHNldHRlciAmJiBzZXR0ZXIuYmluZCh0aGlzUHJveHkpO1xuICAgICAgICAgICAgaWYgKGdldHRlcilcbiAgICAgICAgICAgICAgZ2V0dGVyLl94X2FscmVhZHlCb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoc2V0dGVyKVxuICAgICAgICAgICAgICBzZXR0ZXIuX3hfYWxyZWFkeUJvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgICAgICAgICAgLi4ucHJvcGVydHksXG4gICAgICAgICAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgICAgICAgICBzZXQ6IHNldHRlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pIHx8IHt9KVtuYW1lXTtcbiAgICB9LFxuICAgIHNldDogKHRhcmdldCwgbmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGxldCBjbG9zZXN0T2JqZWN0V2l0aEtleSA9IG9iamVjdHMuZmluZCgob2JqKSA9PiBvYmouaGFzT3duUHJvcGVydHkobmFtZSkpO1xuICAgICAgaWYgKGNsb3Nlc3RPYmplY3RXaXRoS2V5KSB7XG4gICAgICAgIGNsb3Nlc3RPYmplY3RXaXRoS2V5W25hbWVdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3RzW29iamVjdHMubGVuZ3RoIC0gMV1bbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0aGlzUHJveHk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9pbnRlcmNlcHRvci5qc1xuZnVuY3Rpb24gaW5pdEludGVyY2VwdG9ycyhkYXRhMikge1xuICBsZXQgaXNPYmplY3QyID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbCAhPT0gbnVsbDtcbiAgbGV0IHJlY3Vyc2UgPSAob2JqLCBiYXNlUGF0aCA9IFwiXCIpID0+IHtcbiAgICBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmopKS5mb3JFYWNoKChba2V5LCB7dmFsdWUsIGVudW1lcmFibGV9XSkgPT4ge1xuICAgICAgaWYgKGVudW1lcmFibGUgPT09IGZhbHNlIHx8IHZhbHVlID09PSB2b2lkIDApXG4gICAgICAgIHJldHVybjtcbiAgICAgIGxldCBwYXRoID0gYmFzZVBhdGggPT09IFwiXCIgPyBrZXkgOiBgJHtiYXNlUGF0aH0uJHtrZXl9YDtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUuX3hfaW50ZXJjZXB0b3IpIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWx1ZS5pbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0Mih2YWx1ZSkgJiYgdmFsdWUgIT09IG9iaiAmJiAhKHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgICAgICByZWN1cnNlKHZhbHVlLCBwYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICByZXR1cm4gcmVjdXJzZShkYXRhMik7XG59XG5mdW5jdGlvbiBpbnRlcmNlcHRvcihjYWxsYmFjaywgbXV0YXRlT2JqID0gKCkgPT4ge1xufSkge1xuICBsZXQgb2JqID0ge1xuICAgIGluaXRpYWxWYWx1ZTogdm9pZCAwLFxuICAgIF94X2ludGVyY2VwdG9yOiB0cnVlLFxuICAgIGluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuaW5pdGlhbFZhbHVlLCAoKSA9PiBnZXQoZGF0YTIsIHBhdGgpLCAodmFsdWUpID0+IHNldChkYXRhMiwgcGF0aCwgdmFsdWUpLCBwYXRoLCBrZXkpO1xuICAgIH1cbiAgfTtcbiAgbXV0YXRlT2JqKG9iaik7XG4gIHJldHVybiAoaW5pdGlhbFZhbHVlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpbml0aWFsVmFsdWUgPT09IFwib2JqZWN0XCIgJiYgaW5pdGlhbFZhbHVlICE9PSBudWxsICYmIGluaXRpYWxWYWx1ZS5feF9pbnRlcmNlcHRvcikge1xuICAgICAgbGV0IGluaXRpYWxpemUgPSBvYmouaW5pdGlhbGl6ZS5iaW5kKG9iaik7XG4gICAgICBvYmouaW5pdGlhbGl6ZSA9IChkYXRhMiwgcGF0aCwga2V5KSA9PiB7XG4gICAgICAgIGxldCBpbm5lclZhbHVlID0gaW5pdGlhbFZhbHVlLmluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSk7XG4gICAgICAgIG9iai5pbml0aWFsVmFsdWUgPSBpbm5lclZhbHVlO1xuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iai5pbml0aWFsVmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG59XG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KFwiLlwiKS5yZWR1Y2UoKGNhcnJ5LCBzZWdtZW50KSA9PiBjYXJyeVtzZWdtZW50XSwgb2JqKTtcbn1cbmZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIilcbiAgICBwYXRoID0gcGF0aC5zcGxpdChcIi5cIik7XG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMSlcbiAgICBvYmpbcGF0aFswXV0gPSB2YWx1ZTtcbiAgZWxzZSBpZiAocGF0aC5sZW5ndGggPT09IDApXG4gICAgdGhyb3cgZXJyb3I7XG4gIGVsc2Uge1xuICAgIGlmIChvYmpbcGF0aFswXV0pXG4gICAgICByZXR1cm4gc2V0KG9ialtwYXRoWzBdXSwgcGF0aC5zbGljZSgxKSwgdmFsdWUpO1xuICAgIGVsc2Uge1xuICAgICAgb2JqW3BhdGhbMF1dID0ge307XG4gICAgICByZXR1cm4gc2V0KG9ialtwYXRoWzBdXSwgcGF0aC5zbGljZSgxKSwgdmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLmpzXG52YXIgbWFnaWNzID0ge307XG5mdW5jdGlvbiBtYWdpYyhuYW1lLCBjYWxsYmFjaykge1xuICBtYWdpY3NbbmFtZV0gPSBjYWxsYmFjaztcbn1cbmZ1bmN0aW9uIGluamVjdE1hZ2ljcyhvYmosIGVsKSB7XG4gIE9iamVjdC5lbnRyaWVzKG1hZ2ljcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGAkJHtuYW1lfWAsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgbGV0IFt1dGlsaXRpZXMsIGNsZWFudXAyXSA9IGdldEVsZW1lbnRCb3VuZFV0aWxpdGllcyhlbCk7XG4gICAgICAgIHV0aWxpdGllcyA9IHtpbnRlcmNlcHRvciwgLi4udXRpbGl0aWVzfTtcbiAgICAgICAgb25FbFJlbW92ZWQoZWwsIGNsZWFudXAyKTtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVsLCB1dGlsaXRpZXMpO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvZXJyb3IuanNcbmZ1bmN0aW9uIHRyeUNhdGNoKGVsLCBleHByZXNzaW9uLCBjYWxsYmFjaywgLi4uYXJncykge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayguLi5hcmdzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGhhbmRsZUVycm9yKGUsIGVsLCBleHByZXNzaW9uKTtcbiAgfVxufVxuZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbiA9IHZvaWQgMCkge1xuICBPYmplY3QuYXNzaWduKGVycm9yMiwge2VsLCBleHByZXNzaW9ufSk7XG4gIGNvbnNvbGUud2FybihgQWxwaW5lIEV4cHJlc3Npb24gRXJyb3I6ICR7ZXJyb3IyLm1lc3NhZ2V9XG5cbiR7ZXhwcmVzc2lvbiA/ICdFeHByZXNzaW9uOiBcIicgKyBleHByZXNzaW9uICsgJ1wiXFxuXFxuJyA6IFwiXCJ9YCwgZWwpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICB0aHJvdyBlcnJvcjI7XG4gIH0sIDApO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZXZhbHVhdG9yLmpzXG52YXIgc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zID0gdHJ1ZTtcbmZ1bmN0aW9uIGRvbnRBdXRvRXZhbHVhdGVGdW5jdGlvbnMoY2FsbGJhY2spIHtcbiAgbGV0IGNhY2hlID0gc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zO1xuICBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgPSBmYWxzZTtcbiAgY2FsbGJhY2soKTtcbiAgc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zID0gY2FjaGU7XG59XG5mdW5jdGlvbiBldmFsdWF0ZShlbCwgZXhwcmVzc2lvbiwgZXh0cmFzID0ge30pIHtcbiAgbGV0IHJlc3VsdDtcbiAgZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbikoKHZhbHVlKSA9PiByZXN1bHQgPSB2YWx1ZSwgZXh0cmFzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGV2YWx1YXRlTGF0ZXIoLi4uYXJncykge1xuICByZXR1cm4gdGhlRXZhbHVhdG9yRnVuY3Rpb24oLi4uYXJncyk7XG59XG52YXIgdGhlRXZhbHVhdG9yRnVuY3Rpb24gPSBub3JtYWxFdmFsdWF0b3I7XG5mdW5jdGlvbiBzZXRFdmFsdWF0b3IobmV3RXZhbHVhdG9yKSB7XG4gIHRoZUV2YWx1YXRvckZ1bmN0aW9uID0gbmV3RXZhbHVhdG9yO1xufVxuZnVuY3Rpb24gbm9ybWFsRXZhbHVhdG9yKGVsLCBleHByZXNzaW9uKSB7XG4gIGxldCBvdmVycmlkZGVuTWFnaWNzID0ge307XG4gIGluamVjdE1hZ2ljcyhvdmVycmlkZGVuTWFnaWNzLCBlbCk7XG4gIGxldCBkYXRhU3RhY2sgPSBbb3ZlcnJpZGRlbk1hZ2ljcywgLi4uY2xvc2VzdERhdGFTdGFjayhlbCldO1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBnZW5lcmF0ZUV2YWx1YXRvckZyb21GdW5jdGlvbihkYXRhU3RhY2ssIGV4cHJlc3Npb24pO1xuICB9XG4gIGxldCBldmFsdWF0b3IgPSBnZW5lcmF0ZUV2YWx1YXRvckZyb21TdHJpbmcoZGF0YVN0YWNrLCBleHByZXNzaW9uLCBlbCk7XG4gIHJldHVybiB0cnlDYXRjaC5iaW5kKG51bGwsIGVsLCBleHByZXNzaW9uLCBldmFsdWF0b3IpO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVFdmFsdWF0b3JGcm9tRnVuY3Rpb24oZGF0YVN0YWNrLCBmdW5jKSB7XG4gIHJldHVybiAocmVjZWl2ZXIgPSAoKSA9PiB7XG4gIH0sIHtzY29wZTogc2NvcGUyID0ge30sIHBhcmFtcyA9IFtdfSA9IHt9KSA9PiB7XG4gICAgbGV0IHJlc3VsdCA9IGZ1bmMuYXBwbHkobWVyZ2VQcm94aWVzKFtzY29wZTIsIC4uLmRhdGFTdGFja10pLCBwYXJhbXMpO1xuICAgIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIHJlc3VsdCk7XG4gIH07XG59XG52YXIgZXZhbHVhdG9yTWVtbyA9IHt9O1xuZnVuY3Rpb24gZ2VuZXJhdGVGdW5jdGlvbkZyb21TdHJpbmcoZXhwcmVzc2lvbiwgZWwpIHtcbiAgaWYgKGV2YWx1YXRvck1lbW9bZXhwcmVzc2lvbl0pIHtcbiAgICByZXR1cm4gZXZhbHVhdG9yTWVtb1tleHByZXNzaW9uXTtcbiAgfVxuICBsZXQgQXN5bmNGdW5jdGlvbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihhc3luYyBmdW5jdGlvbigpIHtcbiAgfSkuY29uc3RydWN0b3I7XG4gIGxldCByaWdodFNpZGVTYWZlRXhwcmVzc2lvbiA9IC9eW1xcblxcc10qaWYuKlxcKC4qXFwpLy50ZXN0KGV4cHJlc3Npb24pIHx8IC9eKGxldHxjb25zdClcXHMvLnRlc3QoZXhwcmVzc2lvbikgPyBgKCgpID0+IHsgJHtleHByZXNzaW9ufSB9KSgpYCA6IGV4cHJlc3Npb247XG4gIGNvbnN0IHNhZmVBc3luY0Z1bmN0aW9uID0gKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gbmV3IEFzeW5jRnVuY3Rpb24oW1wiX19zZWxmXCIsIFwic2NvcGVcIl0sIGB3aXRoIChzY29wZSkgeyBfX3NlbGYucmVzdWx0ID0gJHtyaWdodFNpZGVTYWZlRXhwcmVzc2lvbn0gfTsgX19zZWxmLmZpbmlzaGVkID0gdHJ1ZTsgcmV0dXJuIF9fc2VsZi5yZXN1bHQ7YCk7XG4gICAgfSBjYXRjaCAoZXJyb3IyKSB7XG4gICAgICBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH07XG4gIGxldCBmdW5jID0gc2FmZUFzeW5jRnVuY3Rpb24oKTtcbiAgZXZhbHVhdG9yTWVtb1tleHByZXNzaW9uXSA9IGZ1bmM7XG4gIHJldHVybiBmdW5jO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVFdmFsdWF0b3JGcm9tU3RyaW5nKGRhdGFTdGFjaywgZXhwcmVzc2lvbiwgZWwpIHtcbiAgbGV0IGZ1bmMgPSBnZW5lcmF0ZUZ1bmN0aW9uRnJvbVN0cmluZyhleHByZXNzaW9uLCBlbCk7XG4gIHJldHVybiAocmVjZWl2ZXIgPSAoKSA9PiB7XG4gIH0sIHtzY29wZTogc2NvcGUyID0ge30sIHBhcmFtcyA9IFtdfSA9IHt9KSA9PiB7XG4gICAgZnVuYy5yZXN1bHQgPSB2b2lkIDA7XG4gICAgZnVuYy5maW5pc2hlZCA9IGZhbHNlO1xuICAgIGxldCBjb21wbGV0ZVNjb3BlID0gbWVyZ2VQcm94aWVzKFtzY29wZTIsIC4uLmRhdGFTdGFja10pO1xuICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBsZXQgcHJvbWlzZSA9IGZ1bmMoZnVuYywgY29tcGxldGVTY29wZSkuY2F0Y2goKGVycm9yMikgPT4gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbikpO1xuICAgICAgaWYgKGZ1bmMuZmluaXNoZWQpIHtcbiAgICAgICAgcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgZnVuYy5yZXN1bHQsIGNvbXBsZXRlU2NvcGUsIHBhcmFtcywgZWwpO1xuICAgICAgICBmdW5jLnJlc3VsdCA9IHZvaWQgMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgcmVzdWx0LCBjb21wbGV0ZVNjb3BlLCBwYXJhbXMsIGVsKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yMikgPT4gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbikpLmZpbmFsbHkoKCkgPT4gZnVuYy5yZXN1bHQgPSB2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIHZhbHVlLCBzY29wZTIsIHBhcmFtcywgZWwpIHtcbiAgaWYgKHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyAmJiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGxldCByZXN1bHQgPSB2YWx1ZS5hcHBseShzY29wZTIsIHBhcmFtcyk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHJlc3VsdC50aGVuKChpKSA9PiBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCBpLCBzY29wZTIsIHBhcmFtcykpLmNhdGNoKChlcnJvcjIpID0+IGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIHZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY2VpdmVyKHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlY2VpdmVyKHZhbHVlKTtcbiAgfVxufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy5qc1xudmFyIHByZWZpeEFzU3RyaW5nID0gXCJ4LVwiO1xuZnVuY3Rpb24gcHJlZml4KHN1YmplY3QgPSBcIlwiKSB7XG4gIHJldHVybiBwcmVmaXhBc1N0cmluZyArIHN1YmplY3Q7XG59XG5mdW5jdGlvbiBzZXRQcmVmaXgobmV3UHJlZml4KSB7XG4gIHByZWZpeEFzU3RyaW5nID0gbmV3UHJlZml4O1xufVxudmFyIGRpcmVjdGl2ZUhhbmRsZXJzID0ge307XG5mdW5jdGlvbiBkaXJlY3RpdmUobmFtZSwgY2FsbGJhY2spIHtcbiAgZGlyZWN0aXZlSGFuZGxlcnNbbmFtZV0gPSBjYWxsYmFjaztcbn1cbmZ1bmN0aW9uIGRpcmVjdGl2ZXMoZWwsIGF0dHJpYnV0ZXMsIG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUpIHtcbiAgYXR0cmlidXRlcyA9IEFycmF5LmZyb20oYXR0cmlidXRlcyk7XG4gIGlmIChlbC5feF92aXJ0dWFsRGlyZWN0aXZlcykge1xuICAgIGxldCB2QXR0cmlidXRlcyA9IE9iamVjdC5lbnRyaWVzKGVsLl94X3ZpcnR1YWxEaXJlY3RpdmVzKS5tYXAoKFtuYW1lLCB2YWx1ZV0pID0+ICh7bmFtZSwgdmFsdWV9KSk7XG4gICAgbGV0IHN0YXRpY0F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzT25seSh2QXR0cmlidXRlcyk7XG4gICAgdkF0dHJpYnV0ZXMgPSB2QXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgaWYgKHN0YXRpY0F0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT4gYXR0ci5uYW1lID09PSBhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBgeC1iaW5kOiR7YXR0cmlidXRlLm5hbWV9YCxcbiAgICAgICAgICB2YWx1ZTogYFwiJHthdHRyaWJ1dGUudmFsdWV9XCJgXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXR0cmlidXRlO1xuICAgIH0pO1xuICAgIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzLmNvbmNhdCh2QXR0cmlidXRlcyk7XG4gIH1cbiAgbGV0IHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwID0ge307XG4gIGxldCBkaXJlY3RpdmVzMiA9IGF0dHJpYnV0ZXMubWFwKHRvVHJhbnNmb3JtZWRBdHRyaWJ1dGVzKChuZXdOYW1lLCBvbGROYW1lKSA9PiB0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcFtuZXdOYW1lXSA9IG9sZE5hbWUpKS5maWx0ZXIob3V0Tm9uQWxwaW5lQXR0cmlidXRlcykubWFwKHRvUGFyc2VkRGlyZWN0aXZlcyh0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcCwgb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSkpLnNvcnQoYnlQcmlvcml0eSk7XG4gIHJldHVybiBkaXJlY3RpdmVzMi5tYXAoKGRpcmVjdGl2ZTIpID0+IHtcbiAgICByZXR1cm4gZ2V0RGlyZWN0aXZlSGFuZGxlcihlbCwgZGlyZWN0aXZlMik7XG4gIH0pO1xufVxuZnVuY3Rpb24gYXR0cmlidXRlc09ubHkoYXR0cmlidXRlcykge1xuICByZXR1cm4gQXJyYXkuZnJvbShhdHRyaWJ1dGVzKS5tYXAodG9UcmFuc2Zvcm1lZEF0dHJpYnV0ZXMoKSkuZmlsdGVyKChhdHRyKSA9PiAhb3V0Tm9uQWxwaW5lQXR0cmlidXRlcyhhdHRyKSk7XG59XG52YXIgaXNEZWZlcnJpbmdIYW5kbGVycyA9IGZhbHNlO1xudmFyIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MgPSBuZXcgTWFwKCk7XG52YXIgY3VycmVudEhhbmRsZXJTdGFja0tleSA9IFN5bWJvbCgpO1xuZnVuY3Rpb24gZGVmZXJIYW5kbGluZ0RpcmVjdGl2ZXMoY2FsbGJhY2spIHtcbiAgaXNEZWZlcnJpbmdIYW5kbGVycyA9IHRydWU7XG4gIGxldCBrZXkgPSBTeW1ib2woKTtcbiAgY3VycmVudEhhbmRsZXJTdGFja0tleSA9IGtleTtcbiAgZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5zZXQoa2V5LCBbXSk7XG4gIGxldCBmbHVzaEhhbmRsZXJzID0gKCkgPT4ge1xuICAgIHdoaWxlIChkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLmdldChrZXkpLmxlbmd0aClcbiAgICAgIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZ2V0KGtleSkuc2hpZnQoKSgpO1xuICAgIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZGVsZXRlKGtleSk7XG4gIH07XG4gIGxldCBzdG9wRGVmZXJyaW5nID0gKCkgPT4ge1xuICAgIGlzRGVmZXJyaW5nSGFuZGxlcnMgPSBmYWxzZTtcbiAgICBmbHVzaEhhbmRsZXJzKCk7XG4gIH07XG4gIGNhbGxiYWNrKGZsdXNoSGFuZGxlcnMpO1xuICBzdG9wRGVmZXJyaW5nKCk7XG59XG5mdW5jdGlvbiBnZXRFbGVtZW50Qm91bmRVdGlsaXRpZXMoZWwpIHtcbiAgbGV0IGNsZWFudXBzID0gW107XG4gIGxldCBjbGVhbnVwMiA9IChjYWxsYmFjaykgPT4gY2xlYW51cHMucHVzaChjYWxsYmFjayk7XG4gIGxldCBbZWZmZWN0MywgY2xlYW51cEVmZmVjdF0gPSBlbGVtZW50Qm91bmRFZmZlY3QoZWwpO1xuICBjbGVhbnVwcy5wdXNoKGNsZWFudXBFZmZlY3QpO1xuICBsZXQgdXRpbGl0aWVzID0ge1xuICAgIEFscGluZTogYWxwaW5lX2RlZmF1bHQsXG4gICAgZWZmZWN0OiBlZmZlY3QzLFxuICAgIGNsZWFudXA6IGNsZWFudXAyLFxuICAgIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIuYmluZChldmFsdWF0ZUxhdGVyLCBlbCksXG4gICAgZXZhbHVhdGU6IGV2YWx1YXRlLmJpbmQoZXZhbHVhdGUsIGVsKVxuICB9O1xuICBsZXQgZG9DbGVhbnVwID0gKCkgPT4gY2xlYW51cHMuZm9yRWFjaCgoaSkgPT4gaSgpKTtcbiAgcmV0dXJuIFt1dGlsaXRpZXMsIGRvQ2xlYW51cF07XG59XG5mdW5jdGlvbiBnZXREaXJlY3RpdmVIYW5kbGVyKGVsLCBkaXJlY3RpdmUyKSB7XG4gIGxldCBub29wID0gKCkgPT4ge1xuICB9O1xuICBsZXQgaGFuZGxlcjMgPSBkaXJlY3RpdmVIYW5kbGVyc1tkaXJlY3RpdmUyLnR5cGVdIHx8IG5vb3A7XG4gIGxldCBbdXRpbGl0aWVzLCBjbGVhbnVwMl0gPSBnZXRFbGVtZW50Qm91bmRVdGlsaXRpZXMoZWwpO1xuICBvbkF0dHJpYnV0ZVJlbW92ZWQoZWwsIGRpcmVjdGl2ZTIub3JpZ2luYWwsIGNsZWFudXAyKTtcbiAgbGV0IGZ1bGxIYW5kbGVyID0gKCkgPT4ge1xuICAgIGlmIChlbC5feF9pZ25vcmUgfHwgZWwuX3hfaWdub3JlU2VsZilcbiAgICAgIHJldHVybjtcbiAgICBoYW5kbGVyMy5pbmxpbmUgJiYgaGFuZGxlcjMuaW5saW5lKGVsLCBkaXJlY3RpdmUyLCB1dGlsaXRpZXMpO1xuICAgIGhhbmRsZXIzID0gaGFuZGxlcjMuYmluZChoYW5kbGVyMywgZWwsIGRpcmVjdGl2ZTIsIHV0aWxpdGllcyk7XG4gICAgaXNEZWZlcnJpbmdIYW5kbGVycyA/IGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZ2V0KGN1cnJlbnRIYW5kbGVyU3RhY2tLZXkpLnB1c2goaGFuZGxlcjMpIDogaGFuZGxlcjMoKTtcbiAgfTtcbiAgZnVsbEhhbmRsZXIucnVuQ2xlYW51cHMgPSBjbGVhbnVwMjtcbiAgcmV0dXJuIGZ1bGxIYW5kbGVyO1xufVxudmFyIHN0YXJ0aW5nV2l0aCA9IChzdWJqZWN0LCByZXBsYWNlbWVudCkgPT4gKHtuYW1lLCB2YWx1ZX0pID0+IHtcbiAgaWYgKG5hbWUuc3RhcnRzV2l0aChzdWJqZWN0KSlcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKHN1YmplY3QsIHJlcGxhY2VtZW50KTtcbiAgcmV0dXJuIHtuYW1lLCB2YWx1ZX07XG59O1xudmFyIGludG8gPSAoaSkgPT4gaTtcbmZ1bmN0aW9uIHRvVHJhbnNmb3JtZWRBdHRyaWJ1dGVzKGNhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICByZXR1cm4gKHtuYW1lLCB2YWx1ZX0pID0+IHtcbiAgICBsZXQge25hbWU6IG5ld05hbWUsIHZhbHVlOiBuZXdWYWx1ZX0gPSBhdHRyaWJ1dGVUcmFuc2Zvcm1lcnMucmVkdWNlKChjYXJyeSwgdHJhbnNmb3JtKSA9PiB7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtKGNhcnJ5KTtcbiAgICB9LCB7bmFtZSwgdmFsdWV9KTtcbiAgICBpZiAobmV3TmFtZSAhPT0gbmFtZSlcbiAgICAgIGNhbGxiYWNrKG5ld05hbWUsIG5hbWUpO1xuICAgIHJldHVybiB7bmFtZTogbmV3TmFtZSwgdmFsdWU6IG5ld1ZhbHVlfTtcbiAgfTtcbn1cbnZhciBhdHRyaWJ1dGVUcmFuc2Zvcm1lcnMgPSBbXTtcbmZ1bmN0aW9uIG1hcEF0dHJpYnV0ZXMoY2FsbGJhY2spIHtcbiAgYXR0cmlidXRlVHJhbnNmb3JtZXJzLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gb3V0Tm9uQWxwaW5lQXR0cmlidXRlcyh7bmFtZX0pIHtcbiAgcmV0dXJuIGFscGluZUF0dHJpYnV0ZVJlZ2V4KCkudGVzdChuYW1lKTtcbn1cbnZhciBhbHBpbmVBdHRyaWJ1dGVSZWdleCA9ICgpID0+IG5ldyBSZWdFeHAoYF4ke3ByZWZpeEFzU3RyaW5nfShbXjpeLl0rKVxcXFxiYCk7XG5mdW5jdGlvbiB0b1BhcnNlZERpcmVjdGl2ZXModHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXAsIG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUpIHtcbiAgcmV0dXJuICh7bmFtZSwgdmFsdWV9KSA9PiB7XG4gICAgbGV0IHR5cGVNYXRjaCA9IG5hbWUubWF0Y2goYWxwaW5lQXR0cmlidXRlUmVnZXgoKSk7XG4gICAgbGV0IHZhbHVlTWF0Y2ggPSBuYW1lLm1hdGNoKC86KFthLXpBLVowLTlcXC06XSspLyk7XG4gICAgbGV0IG1vZGlmaWVycyA9IG5hbWUubWF0Y2goL1xcLlteLlxcXV0rKD89W15cXF1dKiQpL2cpIHx8IFtdO1xuICAgIGxldCBvcmlnaW5hbCA9IG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUgfHwgdHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXBbbmFtZV0gfHwgbmFtZTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdHlwZU1hdGNoID8gdHlwZU1hdGNoWzFdIDogbnVsbCxcbiAgICAgIHZhbHVlOiB2YWx1ZU1hdGNoID8gdmFsdWVNYXRjaFsxXSA6IG51bGwsXG4gICAgICBtb2RpZmllcnM6IG1vZGlmaWVycy5tYXAoKGkpID0+IGkucmVwbGFjZShcIi5cIiwgXCJcIikpLFxuICAgICAgZXhwcmVzc2lvbjogdmFsdWUsXG4gICAgICBvcmlnaW5hbFxuICAgIH07XG4gIH07XG59XG52YXIgREVGQVVMVCA9IFwiREVGQVVMVFwiO1xudmFyIGRpcmVjdGl2ZU9yZGVyID0gW1xuICBcImlnbm9yZVwiLFxuICBcInJlZlwiLFxuICBcImRhdGFcIixcbiAgXCJpZFwiLFxuICBcInJhZGlvXCIsXG4gIFwidGFic1wiLFxuICBcInN3aXRjaFwiLFxuICBcImRpc2Nsb3N1cmVcIixcbiAgXCJtZW51XCIsXG4gIFwibGlzdGJveFwiLFxuICBcImxpc3RcIixcbiAgXCJpdGVtXCIsXG4gIFwiY29tYm9ib3hcIixcbiAgXCJiaW5kXCIsXG4gIFwiaW5pdFwiLFxuICBcImZvclwiLFxuICBcIm1hc2tcIixcbiAgXCJtb2RlbFwiLFxuICBcIm1vZGVsYWJsZVwiLFxuICBcInRyYW5zaXRpb25cIixcbiAgXCJzaG93XCIsXG4gIFwiaWZcIixcbiAgREVGQVVMVCxcbiAgXCJ0ZWxlcG9ydFwiXG5dO1xuZnVuY3Rpb24gYnlQcmlvcml0eShhLCBiKSB7XG4gIGxldCB0eXBlQSA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoYS50eXBlKSA9PT0gLTEgPyBERUZBVUxUIDogYS50eXBlO1xuICBsZXQgdHlwZUIgPSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKGIudHlwZSkgPT09IC0xID8gREVGQVVMVCA6IGIudHlwZTtcbiAgcmV0dXJuIGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YodHlwZUEpIC0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZih0eXBlQik7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9kaXNwYXRjaC5qc1xuZnVuY3Rpb24gZGlzcGF0Y2goZWwsIG5hbWUsIGRldGFpbCA9IHt9KSB7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KG5hbWUsIHtcbiAgICBkZXRhaWwsXG4gICAgYnViYmxlczogdHJ1ZSxcbiAgICBjb21wb3NlZDogdHJ1ZSxcbiAgICBjYW5jZWxhYmxlOiB0cnVlXG4gIH0pKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL25leHRUaWNrLmpzXG52YXIgdGlja1N0YWNrID0gW107XG52YXIgaXNIb2xkaW5nID0gZmFsc2U7XG5mdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGlzSG9sZGluZyB8fCBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzKSA9PiB7XG4gICAgdGlja1N0YWNrLnB1c2goKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJlcygpO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHJlbGVhc2VOZXh0VGlja3MoKSB7XG4gIGlzSG9sZGluZyA9IGZhbHNlO1xuICB3aGlsZSAodGlja1N0YWNrLmxlbmd0aClcbiAgICB0aWNrU3RhY2suc2hpZnQoKSgpO1xufVxuZnVuY3Rpb24gaG9sZE5leHRUaWNrcygpIHtcbiAgaXNIb2xkaW5nID0gdHJ1ZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3dhbGsuanNcbmZ1bmN0aW9uIHdhbGsoZWwsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gXCJmdW5jdGlvblwiICYmIGVsIGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgIEFycmF5LmZyb20oZWwuY2hpbGRyZW4pLmZvckVhY2goKGVsMikgPT4gd2FsayhlbDIsIGNhbGxiYWNrKSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBza2lwID0gZmFsc2U7XG4gIGNhbGxiYWNrKGVsLCAoKSA9PiBza2lwID0gdHJ1ZSk7XG4gIGlmIChza2lwKVxuICAgIHJldHVybjtcbiAgbGV0IG5vZGUgPSBlbC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICB3YWxrKG5vZGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgbm9kZSA9IG5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy93YXJuLmpzXG5mdW5jdGlvbiB3YXJuKG1lc3NhZ2UsIC4uLmFyZ3MpIHtcbiAgY29uc29sZS53YXJuKGBBbHBpbmUgV2FybmluZzogJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbGlmZWN5Y2xlLmpzXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgaWYgKCFkb2N1bWVudC5ib2R5KVxuICAgIHdhcm4oXCJVbmFibGUgdG8gaW5pdGlhbGl6ZS4gVHJ5aW5nIHRvIGxvYWQgQWxwaW5lIGJlZm9yZSBgPGJvZHk+YCBpcyBhdmFpbGFibGUuIERpZCB5b3UgZm9yZ2V0IHRvIGFkZCBgZGVmZXJgIGluIEFscGluZSdzIGA8c2NyaXB0PmAgdGFnP1wiKTtcbiAgZGlzcGF0Y2goZG9jdW1lbnQsIFwiYWxwaW5lOmluaXRcIik7XG4gIGRpc3BhdGNoKGRvY3VtZW50LCBcImFscGluZTppbml0aWFsaXppbmdcIik7XG4gIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zKCk7XG4gIG9uRWxBZGRlZCgoZWwpID0+IGluaXRUcmVlKGVsLCB3YWxrKSk7XG4gIG9uRWxSZW1vdmVkKChlbCkgPT4gZGVzdHJveVRyZWUoZWwpKTtcbiAgb25BdHRyaWJ1dGVzQWRkZWQoKGVsLCBhdHRycykgPT4ge1xuICAgIGRpcmVjdGl2ZXMoZWwsIGF0dHJzKS5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZSgpKTtcbiAgfSk7XG4gIGxldCBvdXROZXN0ZWRDb21wb25lbnRzID0gKGVsKSA9PiAhY2xvc2VzdFJvb3QoZWwucGFyZW50RWxlbWVudCwgdHJ1ZSk7XG4gIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhbGxTZWxlY3RvcnMoKSkpLmZpbHRlcihvdXROZXN0ZWRDb21wb25lbnRzKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgIGluaXRUcmVlKGVsKTtcbiAgfSk7XG4gIGRpc3BhdGNoKGRvY3VtZW50LCBcImFscGluZTppbml0aWFsaXplZFwiKTtcbn1cbnZhciByb290U2VsZWN0b3JDYWxsYmFja3MgPSBbXTtcbnZhciBpbml0U2VsZWN0b3JDYWxsYmFja3MgPSBbXTtcbmZ1bmN0aW9uIHJvb3RTZWxlY3RvcnMoKSB7XG4gIHJldHVybiByb290U2VsZWN0b3JDYWxsYmFja3MubWFwKChmbikgPT4gZm4oKSk7XG59XG5mdW5jdGlvbiBhbGxTZWxlY3RvcnMoKSB7XG4gIHJldHVybiByb290U2VsZWN0b3JDYWxsYmFja3MuY29uY2F0KGluaXRTZWxlY3RvckNhbGxiYWNrcykubWFwKChmbikgPT4gZm4oKSk7XG59XG5mdW5jdGlvbiBhZGRSb290U2VsZWN0b3Ioc2VsZWN0b3JDYWxsYmFjaykge1xuICByb290U2VsZWN0b3JDYWxsYmFja3MucHVzaChzZWxlY3RvckNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGFkZEluaXRTZWxlY3RvcihzZWxlY3RvckNhbGxiYWNrKSB7XG4gIGluaXRTZWxlY3RvckNhbGxiYWNrcy5wdXNoKHNlbGVjdG9yQ2FsbGJhY2spO1xufVxuZnVuY3Rpb24gY2xvc2VzdFJvb3QoZWwsIGluY2x1ZGVJbml0U2VsZWN0b3JzID0gZmFsc2UpIHtcbiAgcmV0dXJuIGZpbmRDbG9zZXN0KGVsLCAoZWxlbWVudCkgPT4ge1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IGluY2x1ZGVJbml0U2VsZWN0b3JzID8gYWxsU2VsZWN0b3JzKCkgOiByb290U2VsZWN0b3JzKCk7XG4gICAgaWYgKHNlbGVjdG9ycy5zb21lKChzZWxlY3RvcikgPT4gZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBmaW5kQ2xvc2VzdChlbCwgY2FsbGJhY2spIHtcbiAgaWYgKCFlbClcbiAgICByZXR1cm47XG4gIGlmIChjYWxsYmFjayhlbCkpXG4gICAgcmV0dXJuIGVsO1xuICBpZiAoZWwuX3hfdGVsZXBvcnRCYWNrKVxuICAgIGVsID0gZWwuX3hfdGVsZXBvcnRCYWNrO1xuICBpZiAoIWVsLnBhcmVudEVsZW1lbnQpXG4gICAgcmV0dXJuO1xuICByZXR1cm4gZmluZENsb3Nlc3QoZWwucGFyZW50RWxlbWVudCwgY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gaXNSb290KGVsKSB7XG4gIHJldHVybiByb290U2VsZWN0b3JzKCkuc29tZSgoc2VsZWN0b3IpID0+IGVsLm1hdGNoZXMoc2VsZWN0b3IpKTtcbn1cbmZ1bmN0aW9uIGluaXRUcmVlKGVsLCB3YWxrZXIgPSB3YWxrKSB7XG4gIGRlZmVySGFuZGxpbmdEaXJlY3RpdmVzKCgpID0+IHtcbiAgICB3YWxrZXIoZWwsIChlbDIsIHNraXApID0+IHtcbiAgICAgIGRpcmVjdGl2ZXMoZWwyLCBlbDIuYXR0cmlidXRlcykuZm9yRWFjaCgoaGFuZGxlKSA9PiBoYW5kbGUoKSk7XG4gICAgICBlbDIuX3hfaWdub3JlICYmIHNraXAoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiBkZXN0cm95VHJlZShyb290KSB7XG4gIHdhbGsocm9vdCwgKGVsKSA9PiBjbGVhbnVwQXR0cmlidXRlcyhlbCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvY2xhc3Nlcy5qc1xuZnVuY3Rpb24gc2V0Q2xhc3NlcyhlbCwgdmFsdWUpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHNldENsYXNzZXNGcm9tU3RyaW5nKGVsLCB2YWx1ZS5qb2luKFwiIFwiKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHNldENsYXNzZXNGcm9tT2JqZWN0KGVsLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gc2V0Q2xhc3NlcyhlbCwgdmFsdWUoKSk7XG4gIH1cbiAgcmV0dXJuIHNldENsYXNzZXNGcm9tU3RyaW5nKGVsLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRDbGFzc2VzRnJvbVN0cmluZyhlbCwgY2xhc3NTdHJpbmcpIHtcbiAgbGV0IHNwbGl0ID0gKGNsYXNzU3RyaW5nMikgPT4gY2xhc3NTdHJpbmcyLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBtaXNzaW5nQ2xhc3NlcyA9IChjbGFzc1N0cmluZzIpID0+IGNsYXNzU3RyaW5nMi5zcGxpdChcIiBcIikuZmlsdGVyKChpKSA9PiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGkpKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBhZGRDbGFzc2VzQW5kUmV0dXJuVW5kbyA9IChjbGFzc2VzKSA9PiB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzKTtcbiAgICB9O1xuICB9O1xuICBjbGFzc1N0cmluZyA9IGNsYXNzU3RyaW5nID09PSB0cnVlID8gY2xhc3NTdHJpbmcgPSBcIlwiIDogY2xhc3NTdHJpbmcgfHwgXCJcIjtcbiAgcmV0dXJuIGFkZENsYXNzZXNBbmRSZXR1cm5VbmRvKG1pc3NpbmdDbGFzc2VzKGNsYXNzU3RyaW5nKSk7XG59XG5mdW5jdGlvbiBzZXRDbGFzc2VzRnJvbU9iamVjdChlbCwgY2xhc3NPYmplY3QpIHtcbiAgbGV0IHNwbGl0ID0gKGNsYXNzU3RyaW5nKSA9PiBjbGFzc1N0cmluZy5zcGxpdChcIiBcIikuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgZm9yQWRkID0gT2JqZWN0LmVudHJpZXMoY2xhc3NPYmplY3QpLmZsYXRNYXAoKFtjbGFzc1N0cmluZywgYm9vbF0pID0+IGJvb2wgPyBzcGxpdChjbGFzc1N0cmluZykgOiBmYWxzZSkuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgZm9yUmVtb3ZlID0gT2JqZWN0LmVudHJpZXMoY2xhc3NPYmplY3QpLmZsYXRNYXAoKFtjbGFzc1N0cmluZywgYm9vbF0pID0+ICFib29sID8gc3BsaXQoY2xhc3NTdHJpbmcpIDogZmFsc2UpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGFkZGVkID0gW107XG4gIGxldCByZW1vdmVkID0gW107XG4gIGZvclJlbW92ZS5mb3JFYWNoKChpKSA9PiB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhpKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShpKTtcbiAgICAgIHJlbW92ZWQucHVzaChpKTtcbiAgICB9XG4gIH0pO1xuICBmb3JBZGQuZm9yRWFjaCgoaSkgPT4ge1xuICAgIGlmICghZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGkpKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGkpO1xuICAgICAgYWRkZWQucHVzaChpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHJlbW92ZWQuZm9yRWFjaCgoaSkgPT4gZWwuY2xhc3NMaXN0LmFkZChpKSk7XG4gICAgYWRkZWQuZm9yRWFjaCgoaSkgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShpKSk7XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9zdHlsZXMuanNcbmZ1bmN0aW9uIHNldFN0eWxlcyhlbCwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgIHJldHVybiBzZXRTdHlsZXNGcm9tT2JqZWN0KGVsLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHNldFN0eWxlc0Zyb21TdHJpbmcoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldFN0eWxlc0Zyb21PYmplY3QoZWwsIHZhbHVlKSB7XG4gIGxldCBwcmV2aW91c1N0eWxlcyA9IHt9O1xuICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoW2tleSwgdmFsdWUyXSkgPT4ge1xuICAgIHByZXZpb3VzU3R5bGVzW2tleV0gPSBlbC5zdHlsZVtrZXldO1xuICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoXCItLVwiKSkge1xuICAgICAga2V5ID0ga2ViYWJDYXNlKGtleSk7XG4gICAgfVxuICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUyKTtcbiAgfSk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChlbC5zdHlsZS5sZW5ndGggPT09IDApIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgc2V0U3R5bGVzKGVsLCBwcmV2aW91c1N0eWxlcyk7XG4gIH07XG59XG5mdW5jdGlvbiBzZXRTdHlsZXNGcm9tU3RyaW5nKGVsLCB2YWx1ZSkge1xuICBsZXQgY2FjaGUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCB2YWx1ZSk7XG4gIGVsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIHZhbHVlKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBjYWNoZSB8fCBcIlwiKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGtlYmFiQ2FzZShzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIFwiJDEtJDJcIikudG9Mb3dlckNhc2UoKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL29uY2UuanNcbmZ1bmN0aW9uIG9uY2UoY2FsbGJhY2ssIGZhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICBsZXQgY2FsbGVkID0gZmFsc2U7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRyYW5zaXRpb24uanNcbmRpcmVjdGl2ZShcInRyYW5zaXRpb25cIiwgKGVsLCB7dmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbn0sIHtldmFsdWF0ZTogZXZhbHVhdGUyfSkgPT4ge1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwiZnVuY3Rpb25cIilcbiAgICBleHByZXNzaW9uID0gZXZhbHVhdGUyKGV4cHJlc3Npb24pO1xuICBpZiAoIWV4cHJlc3Npb24pIHtcbiAgICByZWdpc3RlclRyYW5zaXRpb25zRnJvbUhlbHBlcihlbCwgbW9kaWZpZXJzLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21DbGFzc1N0cmluZyhlbCwgZXhwcmVzc2lvbiwgdmFsdWUpO1xuICB9XG59KTtcbmZ1bmN0aW9uIHJlZ2lzdGVyVHJhbnNpdGlvbnNGcm9tQ2xhc3NTdHJpbmcoZWwsIGNsYXNzU3RyaW5nLCBzdGFnZSkge1xuICByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldENsYXNzZXMsIFwiXCIpO1xuICBsZXQgZGlyZWN0aXZlU3RvcmFnZU1hcCA9IHtcbiAgICBlbnRlcjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZHVyaW5nID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwiZW50ZXItc3RhcnRcIjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuc3RhcnQgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJlbnRlci1lbmRcIjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZW5kID0gY2xhc3NlcztcbiAgICB9LFxuICAgIGxlYXZlOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5kdXJpbmcgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJsZWF2ZS1zdGFydFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5zdGFydCA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImxlYXZlLWVuZFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5lbmQgPSBjbGFzc2VzO1xuICAgIH1cbiAgfTtcbiAgZGlyZWN0aXZlU3RvcmFnZU1hcFtzdGFnZV0oY2xhc3NTdHJpbmcpO1xufVxuZnVuY3Rpb24gcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21IZWxwZXIoZWwsIG1vZGlmaWVycywgc3RhZ2UpIHtcbiAgcmVnaXN0ZXJUcmFuc2l0aW9uT2JqZWN0KGVsLCBzZXRTdHlsZXMpO1xuICBsZXQgZG9lc250U3BlY2lmeSA9ICFtb2RpZmllcnMuaW5jbHVkZXMoXCJpblwiKSAmJiAhbW9kaWZpZXJzLmluY2x1ZGVzKFwib3V0XCIpICYmICFzdGFnZTtcbiAgbGV0IHRyYW5zaXRpb25pbmdJbiA9IGRvZXNudFNwZWNpZnkgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwiaW5cIikgfHwgW1wiZW50ZXJcIl0uaW5jbHVkZXMoc3RhZ2UpO1xuICBsZXQgdHJhbnNpdGlvbmluZ091dCA9IGRvZXNudFNwZWNpZnkgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwib3V0XCIpIHx8IFtcImxlYXZlXCJdLmluY2x1ZGVzKHN0YWdlKTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImluXCIpICYmICFkb2VzbnRTcGVjaWZ5KSB7XG4gICAgbW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigoaSwgaW5kZXgpID0+IGluZGV4IDwgbW9kaWZpZXJzLmluZGV4T2YoXCJvdXRcIikpO1xuICB9XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgJiYgIWRvZXNudFNwZWNpZnkpIHtcbiAgICBtb2RpZmllcnMgPSBtb2RpZmllcnMuZmlsdGVyKChpLCBpbmRleCkgPT4gaW5kZXggPiBtb2RpZmllcnMuaW5kZXhPZihcIm91dFwiKSk7XG4gIH1cbiAgbGV0IHdhbnRzQWxsID0gIW1vZGlmaWVycy5pbmNsdWRlcyhcIm9wYWNpdHlcIikgJiYgIW1vZGlmaWVycy5pbmNsdWRlcyhcInNjYWxlXCIpO1xuICBsZXQgd2FudHNPcGFjaXR5ID0gd2FudHNBbGwgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwib3BhY2l0eVwiKTtcbiAgbGV0IHdhbnRzU2NhbGUgPSB3YW50c0FsbCB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJzY2FsZVwiKTtcbiAgbGV0IG9wYWNpdHlWYWx1ZSA9IHdhbnRzT3BhY2l0eSA/IDAgOiAxO1xuICBsZXQgc2NhbGVWYWx1ZSA9IHdhbnRzU2NhbGUgPyBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJzY2FsZVwiLCA5NSkgLyAxMDAgOiAxO1xuICBsZXQgZGVsYXkgPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkZWxheVwiLCAwKTtcbiAgbGV0IG9yaWdpbiA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcIm9yaWdpblwiLCBcImNlbnRlclwiKTtcbiAgbGV0IHByb3BlcnR5ID0gXCJvcGFjaXR5LCB0cmFuc2Zvcm1cIjtcbiAgbGV0IGR1cmF0aW9uSW4gPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkdXJhdGlvblwiLCAxNTApIC8gMWUzO1xuICBsZXQgZHVyYXRpb25PdXQgPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkdXJhdGlvblwiLCA3NSkgLyAxZTM7XG4gIGxldCBlYXNpbmcgPSBgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpYDtcbiAgaWYgKHRyYW5zaXRpb25pbmdJbikge1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZHVyaW5nID0ge1xuICAgICAgdHJhbnNmb3JtT3JpZ2luOiBvcmlnaW4sXG4gICAgICB0cmFuc2l0aW9uRGVsYXk6IGRlbGF5LFxuICAgICAgdHJhbnNpdGlvblByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogYCR7ZHVyYXRpb25Jbn1zYCxcbiAgICAgIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbjogZWFzaW5nXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0ID0ge1xuICAgICAgb3BhY2l0eTogb3BhY2l0eVZhbHVlLFxuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoJHtzY2FsZVZhbHVlfSlgXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLmVuZCA9IHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgxKWBcbiAgICB9O1xuICB9XG4gIGlmICh0cmFuc2l0aW9uaW5nT3V0KSB7XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5kdXJpbmcgPSB7XG4gICAgICB0cmFuc2Zvcm1PcmlnaW46IG9yaWdpbixcbiAgICAgIHRyYW5zaXRpb25EZWxheTogZGVsYXksXG4gICAgICB0cmFuc2l0aW9uUHJvcGVydHk6IHByb3BlcnR5LFxuICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBgJHtkdXJhdGlvbk91dH1zYCxcbiAgICAgIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbjogZWFzaW5nXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLnN0YXJ0ID0ge1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDEpYFxuICAgIH07XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5lbmQgPSB7XG4gICAgICBvcGFjaXR5OiBvcGFjaXR5VmFsdWUsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlVmFsdWV9KWBcbiAgICB9O1xuICB9XG59XG5mdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldEZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUgPSB7fSkge1xuICBpZiAoIWVsLl94X3RyYW5zaXRpb24pXG4gICAgZWwuX3hfdHJhbnNpdGlvbiA9IHtcbiAgICAgIGVudGVyOiB7ZHVyaW5nOiBkZWZhdWx0VmFsdWUsIHN0YXJ0OiBkZWZhdWx0VmFsdWUsIGVuZDogZGVmYXVsdFZhbHVlfSxcbiAgICAgIGxlYXZlOiB7ZHVyaW5nOiBkZWZhdWx0VmFsdWUsIHN0YXJ0OiBkZWZhdWx0VmFsdWUsIGVuZDogZGVmYXVsdFZhbHVlfSxcbiAgICAgIGluKGJlZm9yZSA9ICgpID0+IHtcbiAgICAgIH0sIGFmdGVyID0gKCkgPT4ge1xuICAgICAgfSkge1xuICAgICAgICB0cmFuc2l0aW9uKGVsLCBzZXRGdW5jdGlvbiwge1xuICAgICAgICAgIGR1cmluZzogdGhpcy5lbnRlci5kdXJpbmcsXG4gICAgICAgICAgc3RhcnQ6IHRoaXMuZW50ZXIuc3RhcnQsXG4gICAgICAgICAgZW5kOiB0aGlzLmVudGVyLmVuZFxuICAgICAgICB9LCBiZWZvcmUsIGFmdGVyKTtcbiAgICAgIH0sXG4gICAgICBvdXQoYmVmb3JlID0gKCkgPT4ge1xuICAgICAgfSwgYWZ0ZXIgPSAoKSA9PiB7XG4gICAgICB9KSB7XG4gICAgICAgIHRyYW5zaXRpb24oZWwsIHNldEZ1bmN0aW9uLCB7XG4gICAgICAgICAgZHVyaW5nOiB0aGlzLmxlYXZlLmR1cmluZyxcbiAgICAgICAgICBzdGFydDogdGhpcy5sZWF2ZS5zdGFydCxcbiAgICAgICAgICBlbmQ6IHRoaXMubGVhdmUuZW5kXG4gICAgICAgIH0sIGJlZm9yZSwgYWZ0ZXIpO1xuICAgICAgfVxuICAgIH07XG59XG53aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuX3hfdG9nZ2xlQW5kQ2FzY2FkZVdpdGhUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSwgc2hvdywgaGlkZSkge1xuICBjb25zdCBuZXh0VGljazIgPSBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09IFwidmlzaWJsZVwiID8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIDogc2V0VGltZW91dDtcbiAgbGV0IGNsaWNrQXdheUNvbXBhdGlibGVTaG93ID0gKCkgPT4gbmV4dFRpY2syKHNob3cpO1xuICBpZiAodmFsdWUpIHtcbiAgICBpZiAoZWwuX3hfdHJhbnNpdGlvbiAmJiAoZWwuX3hfdHJhbnNpdGlvbi5lbnRlciB8fCBlbC5feF90cmFuc2l0aW9uLmxlYXZlKSkge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlciAmJiAoT2JqZWN0LmVudHJpZXMoZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcpLmxlbmd0aCB8fCBPYmplY3QuZW50cmllcyhlbC5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0KS5sZW5ndGggfHwgT2JqZWN0LmVudHJpZXMoZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5lbmQpLmxlbmd0aCkgPyBlbC5feF90cmFuc2l0aW9uLmluKHNob3cpIDogY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbiA/IGVsLl94X3RyYW5zaXRpb24uaW4oc2hvdykgOiBjbGlja0F3YXlDb21wYXRpYmxlU2hvdygpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgZWwuX3hfaGlkZVByb21pc2UgPSBlbC5feF90cmFuc2l0aW9uID8gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGVsLl94X3RyYW5zaXRpb24ub3V0KCgpID0+IHtcbiAgICB9LCAoKSA9PiByZXNvbHZlKGhpZGUpKTtcbiAgICBlbC5feF90cmFuc2l0aW9uaW5nLmJlZm9yZUNhbmNlbCgoKSA9PiByZWplY3Qoe2lzRnJvbUNhbmNlbGxlZFRyYW5zaXRpb246IHRydWV9KSk7XG4gIH0pIDogUHJvbWlzZS5yZXNvbHZlKGhpZGUpO1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgbGV0IGNsb3Nlc3QgPSBjbG9zZXN0SGlkZShlbCk7XG4gICAgaWYgKGNsb3Nlc3QpIHtcbiAgICAgIGlmICghY2xvc2VzdC5feF9oaWRlQ2hpbGRyZW4pXG4gICAgICAgIGNsb3Nlc3QuX3hfaGlkZUNoaWxkcmVuID0gW107XG4gICAgICBjbG9zZXN0Ll94X2hpZGVDaGlsZHJlbi5wdXNoKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dFRpY2syKCgpID0+IHtcbiAgICAgICAgbGV0IGhpZGVBZnRlckNoaWxkcmVuID0gKGVsMikgPT4ge1xuICAgICAgICAgIGxldCBjYXJyeSA9IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIGVsMi5feF9oaWRlUHJvbWlzZSxcbiAgICAgICAgICAgIC4uLihlbDIuX3hfaGlkZUNoaWxkcmVuIHx8IFtdKS5tYXAoaGlkZUFmdGVyQ2hpbGRyZW4pXG4gICAgICAgICAgXSkudGhlbigoW2ldKSA9PiBpKCkpO1xuICAgICAgICAgIGRlbGV0ZSBlbDIuX3hfaGlkZVByb21pc2U7XG4gICAgICAgICAgZGVsZXRlIGVsMi5feF9oaWRlQ2hpbGRyZW47XG4gICAgICAgICAgcmV0dXJuIGNhcnJ5O1xuICAgICAgICB9O1xuICAgICAgICBoaWRlQWZ0ZXJDaGlsZHJlbihlbCkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICBpZiAoIWUuaXNGcm9tQ2FuY2VsbGVkVHJhbnNpdGlvbilcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5mdW5jdGlvbiBjbG9zZXN0SGlkZShlbCkge1xuICBsZXQgcGFyZW50ID0gZWwucGFyZW50Tm9kZTtcbiAgaWYgKCFwYXJlbnQpXG4gICAgcmV0dXJuO1xuICByZXR1cm4gcGFyZW50Ll94X2hpZGVQcm9taXNlID8gcGFyZW50IDogY2xvc2VzdEhpZGUocGFyZW50KTtcbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb24oZWwsIHNldEZ1bmN0aW9uLCB7ZHVyaW5nLCBzdGFydDogc3RhcnQyLCBlbmR9ID0ge30sIGJlZm9yZSA9ICgpID0+IHtcbn0sIGFmdGVyID0gKCkgPT4ge1xufSkge1xuICBpZiAoZWwuX3hfdHJhbnNpdGlvbmluZylcbiAgICBlbC5feF90cmFuc2l0aW9uaW5nLmNhbmNlbCgpO1xuICBpZiAoT2JqZWN0LmtleXMoZHVyaW5nKS5sZW5ndGggPT09IDAgJiYgT2JqZWN0LmtleXMoc3RhcnQyKS5sZW5ndGggPT09IDAgJiYgT2JqZWN0LmtleXMoZW5kKS5sZW5ndGggPT09IDApIHtcbiAgICBiZWZvcmUoKTtcbiAgICBhZnRlcigpO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgdW5kb1N0YXJ0LCB1bmRvRHVyaW5nLCB1bmRvRW5kO1xuICBwZXJmb3JtVHJhbnNpdGlvbihlbCwge1xuICAgIHN0YXJ0KCkge1xuICAgICAgdW5kb1N0YXJ0ID0gc2V0RnVuY3Rpb24oZWwsIHN0YXJ0Mik7XG4gICAgfSxcbiAgICBkdXJpbmcoKSB7XG4gICAgICB1bmRvRHVyaW5nID0gc2V0RnVuY3Rpb24oZWwsIGR1cmluZyk7XG4gICAgfSxcbiAgICBiZWZvcmUsXG4gICAgZW5kKCkge1xuICAgICAgdW5kb1N0YXJ0KCk7XG4gICAgICB1bmRvRW5kID0gc2V0RnVuY3Rpb24oZWwsIGVuZCk7XG4gICAgfSxcbiAgICBhZnRlcixcbiAgICBjbGVhbnVwKCkge1xuICAgICAgdW5kb0R1cmluZygpO1xuICAgICAgdW5kb0VuZCgpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBwZXJmb3JtVHJhbnNpdGlvbihlbCwgc3RhZ2VzKSB7XG4gIGxldCBpbnRlcnJ1cHRlZCwgcmVhY2hlZEJlZm9yZSwgcmVhY2hlZEVuZDtcbiAgbGV0IGZpbmlzaCA9IG9uY2UoKCkgPT4ge1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBpbnRlcnJ1cHRlZCA9IHRydWU7XG4gICAgICBpZiAoIXJlYWNoZWRCZWZvcmUpXG4gICAgICAgIHN0YWdlcy5iZWZvcmUoKTtcbiAgICAgIGlmICghcmVhY2hlZEVuZCkge1xuICAgICAgICBzdGFnZXMuZW5kKCk7XG4gICAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICAgIH1cbiAgICAgIHN0YWdlcy5hZnRlcigpO1xuICAgICAgaWYgKGVsLmlzQ29ubmVjdGVkKVxuICAgICAgICBzdGFnZXMuY2xlYW51cCgpO1xuICAgICAgZGVsZXRlIGVsLl94X3RyYW5zaXRpb25pbmc7XG4gICAgfSk7XG4gIH0pO1xuICBlbC5feF90cmFuc2l0aW9uaW5nID0ge1xuICAgIGJlZm9yZUNhbmNlbHM6IFtdLFxuICAgIGJlZm9yZUNhbmNlbChjYWxsYmFjaykge1xuICAgICAgdGhpcy5iZWZvcmVDYW5jZWxzLnB1c2goY2FsbGJhY2spO1xuICAgIH0sXG4gICAgY2FuY2VsOiBvbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgd2hpbGUgKHRoaXMuYmVmb3JlQ2FuY2Vscy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5iZWZvcmVDYW5jZWxzLnNoaWZ0KCkoKTtcbiAgICAgIH1cbiAgICAgIDtcbiAgICAgIGZpbmlzaCgpO1xuICAgIH0pLFxuICAgIGZpbmlzaFxuICB9O1xuICBtdXRhdGVEb20oKCkgPT4ge1xuICAgIHN0YWdlcy5zdGFydCgpO1xuICAgIHN0YWdlcy5kdXJpbmcoKTtcbiAgfSk7XG4gIGhvbGROZXh0VGlja3MoKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBpZiAoaW50ZXJydXB0ZWQpXG4gICAgICByZXR1cm47XG4gICAgbGV0IGR1cmF0aW9uID0gTnVtYmVyKGdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EdXJhdGlvbi5yZXBsYWNlKC8sLiovLCBcIlwiKS5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgbGV0IGRlbGF5ID0gTnVtYmVyKGdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EZWxheS5yZXBsYWNlKC8sLiovLCBcIlwiKS5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgaWYgKGR1cmF0aW9uID09PSAwKVxuICAgICAgZHVyYXRpb24gPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkuYW5pbWF0aW9uRHVyYXRpb24ucmVwbGFjZShcInNcIiwgXCJcIikpICogMWUzO1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBzdGFnZXMuYmVmb3JlKCk7XG4gICAgfSk7XG4gICAgcmVhY2hlZEJlZm9yZSA9IHRydWU7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmIChpbnRlcnJ1cHRlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgc3RhZ2VzLmVuZCgpO1xuICAgICAgfSk7XG4gICAgICByZWxlYXNlTmV4dFRpY2tzKCk7XG4gICAgICBzZXRUaW1lb3V0KGVsLl94X3RyYW5zaXRpb25pbmcuZmluaXNoLCBkdXJhdGlvbiArIGRlbGF5KTtcbiAgICAgIHJlYWNoZWRFbmQgPSB0cnVlO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBrZXksIGZhbGxiYWNrKSB7XG4gIGlmIChtb2RpZmllcnMuaW5kZXhPZihrZXkpID09PSAtMSlcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIGNvbnN0IHJhd1ZhbHVlID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAxXTtcbiAgaWYgKCFyYXdWYWx1ZSlcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIGlmIChrZXkgPT09IFwic2NhbGVcIikge1xuICAgIGlmIChpc05hTihyYXdWYWx1ZSkpXG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gIH1cbiAgaWYgKGtleSA9PT0gXCJkdXJhdGlvblwiKSB7XG4gICAgbGV0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goLyhbMC05XSspbXMvKTtcbiAgICBpZiAobWF0Y2gpXG4gICAgICByZXR1cm4gbWF0Y2hbMV07XG4gIH1cbiAgaWYgKGtleSA9PT0gXCJvcmlnaW5cIikge1xuICAgIGlmIChbXCJ0b3BcIiwgXCJyaWdodFwiLCBcImxlZnRcIiwgXCJjZW50ZXJcIiwgXCJib3R0b21cIl0uaW5jbHVkZXMobW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAyXSkpIHtcbiAgICAgIHJldHVybiBbcmF3VmFsdWUsIG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihrZXkpICsgMl1dLmpvaW4oXCIgXCIpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmF3VmFsdWU7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9jbG9uZS5qc1xudmFyIGlzQ2xvbmluZyA9IGZhbHNlO1xuZnVuY3Rpb24gc2tpcER1cmluZ0Nsb25lKGNhbGxiYWNrLCBmYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiBpc0Nsb25pbmcgPyBmYWxsYmFjayguLi5hcmdzKSA6IGNhbGxiYWNrKC4uLmFyZ3MpO1xufVxuZnVuY3Rpb24gY2xvbmUob2xkRWwsIG5ld0VsKSB7XG4gIGlmICghbmV3RWwuX3hfZGF0YVN0YWNrKVxuICAgIG5ld0VsLl94X2RhdGFTdGFjayA9IG9sZEVsLl94X2RhdGFTdGFjaztcbiAgaXNDbG9uaW5nID0gdHJ1ZTtcbiAgZG9udFJlZ2lzdGVyUmVhY3RpdmVTaWRlRWZmZWN0cygoKSA9PiB7XG4gICAgY2xvbmVUcmVlKG5ld0VsKTtcbiAgfSk7XG4gIGlzQ2xvbmluZyA9IGZhbHNlO1xufVxuZnVuY3Rpb24gY2xvbmVUcmVlKGVsKSB7XG4gIGxldCBoYXNSdW5UaHJvdWdoRmlyc3RFbCA9IGZhbHNlO1xuICBsZXQgc2hhbGxvd1dhbGtlciA9IChlbDIsIGNhbGxiYWNrKSA9PiB7XG4gICAgd2FsayhlbDIsIChlbDMsIHNraXApID0+IHtcbiAgICAgIGlmIChoYXNSdW5UaHJvdWdoRmlyc3RFbCAmJiBpc1Jvb3QoZWwzKSlcbiAgICAgICAgcmV0dXJuIHNraXAoKTtcbiAgICAgIGhhc1J1blRocm91Z2hGaXJzdEVsID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrKGVsMywgc2tpcCk7XG4gICAgfSk7XG4gIH07XG4gIGluaXRUcmVlKGVsLCBzaGFsbG93V2Fsa2VyKTtcbn1cbmZ1bmN0aW9uIGRvbnRSZWdpc3RlclJlYWN0aXZlU2lkZUVmZmVjdHMoY2FsbGJhY2spIHtcbiAgbGV0IGNhY2hlID0gZWZmZWN0O1xuICBvdmVycmlkZUVmZmVjdCgoY2FsbGJhY2syLCBlbCkgPT4ge1xuICAgIGxldCBzdG9yZWRFZmZlY3QgPSBjYWNoZShjYWxsYmFjazIpO1xuICAgIHJlbGVhc2Uoc3RvcmVkRWZmZWN0KTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgIH07XG4gIH0pO1xuICBjYWxsYmFjaygpO1xuICBvdmVycmlkZUVmZmVjdChjYWNoZSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9iaW5kLmpzXG5mdW5jdGlvbiBiaW5kKGVsLCBuYW1lLCB2YWx1ZSwgbW9kaWZpZXJzID0gW10pIHtcbiAgaWYgKCFlbC5feF9iaW5kaW5ncylcbiAgICBlbC5feF9iaW5kaW5ncyA9IHJlYWN0aXZlKHt9KTtcbiAgZWwuX3hfYmluZGluZ3NbbmFtZV0gPSB2YWx1ZTtcbiAgbmFtZSA9IG1vZGlmaWVycy5pbmNsdWRlcyhcImNhbWVsXCIpID8gY2FtZWxDYXNlKG5hbWUpIDogbmFtZTtcbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSBcInZhbHVlXCI6XG4gICAgICBiaW5kSW5wdXRWYWx1ZShlbCwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInN0eWxlXCI6XG4gICAgICBiaW5kU3R5bGVzKGVsLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY2xhc3NcIjpcbiAgICAgIGJpbmRDbGFzc2VzKGVsLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYmluZEF0dHJpYnV0ZShlbCwgbmFtZSwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cbmZ1bmN0aW9uIGJpbmRJbnB1dFZhbHVlKGVsLCB2YWx1ZSkge1xuICBpZiAoZWwudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgaWYgKGVsLmF0dHJpYnV0ZXMudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgZWwudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5mcm9tTW9kZWwpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZShlbC52YWx1ZSwgdmFsdWUpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChlbC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgIGVsLnZhbHVlID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJib29sZWFuXCIgJiYgIVtudWxsLCB2b2lkIDBdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9IHZhbHVlLnNvbWUoKHZhbCkgPT4gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUodmFsLCBlbC52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9ICEhdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGVsLnRhZ05hbWUgPT09IFwiU0VMRUNUXCIpIHtcbiAgICB1cGRhdGVTZWxlY3QoZWwsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoZWwudmFsdWUgPT09IHZhbHVlKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLnZhbHVlID0gdmFsdWU7XG4gIH1cbn1cbmZ1bmN0aW9uIGJpbmRDbGFzc2VzKGVsLCB2YWx1ZSkge1xuICBpZiAoZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcylcbiAgICBlbC5feF91bmRvQWRkZWRDbGFzc2VzKCk7XG4gIGVsLl94X3VuZG9BZGRlZENsYXNzZXMgPSBzZXRDbGFzc2VzKGVsLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBiaW5kU3R5bGVzKGVsLCB2YWx1ZSkge1xuICBpZiAoZWwuX3hfdW5kb0FkZGVkU3R5bGVzKVxuICAgIGVsLl94X3VuZG9BZGRlZFN0eWxlcygpO1xuICBlbC5feF91bmRvQWRkZWRTdHlsZXMgPSBzZXRTdHlsZXMoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGUoZWwsIG5hbWUsIHZhbHVlKSB7XG4gIGlmIChbbnVsbCwgdm9pZCAwLCBmYWxzZV0uaW5jbHVkZXModmFsdWUpICYmIGF0dHJpYnV0ZVNob3VsZG50QmVQcmVzZXJ2ZWRJZkZhbHN5KG5hbWUpKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChpc0Jvb2xlYW5BdHRyKG5hbWUpKVxuICAgICAgdmFsdWUgPSBuYW1lO1xuICAgIHNldElmQ2hhbmdlZChlbCwgbmFtZSwgdmFsdWUpO1xuICB9XG59XG5mdW5jdGlvbiBzZXRJZkNoYW5nZWQoZWwsIGF0dHJOYW1lLCB2YWx1ZSkge1xuICBpZiAoZWwuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKSAhPSB2YWx1ZSkge1xuICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgdmFsdWUpO1xuICB9XG59XG5mdW5jdGlvbiB1cGRhdGVTZWxlY3QoZWwsIHZhbHVlKSB7XG4gIGNvbnN0IGFycmF5V3JhcHBlZFZhbHVlID0gW10uY29uY2F0KHZhbHVlKS5tYXAoKHZhbHVlMikgPT4ge1xuICAgIHJldHVybiB2YWx1ZTIgKyBcIlwiO1xuICB9KTtcbiAgQXJyYXkuZnJvbShlbC5vcHRpb25zKS5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICBvcHRpb24uc2VsZWN0ZWQgPSBhcnJheVdyYXBwZWRWYWx1ZS5pbmNsdWRlcyhvcHRpb24udmFsdWUpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGNhbWVsQ2FzZShzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShcXHcpL2csIChtYXRjaCwgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbn1cbmZ1bmN0aW9uIGNoZWNrZWRBdHRyTG9vc2VDb21wYXJlKHZhbHVlQSwgdmFsdWVCKSB7XG4gIHJldHVybiB2YWx1ZUEgPT0gdmFsdWVCO1xufVxuZnVuY3Rpb24gaXNCb29sZWFuQXR0cihhdHRyTmFtZSkge1xuICBjb25zdCBib29sZWFuQXR0cmlidXRlcyA9IFtcbiAgICBcImRpc2FibGVkXCIsXG4gICAgXCJjaGVja2VkXCIsXG4gICAgXCJyZXF1aXJlZFwiLFxuICAgIFwicmVhZG9ubHlcIixcbiAgICBcImhpZGRlblwiLFxuICAgIFwib3BlblwiLFxuICAgIFwic2VsZWN0ZWRcIixcbiAgICBcImF1dG9mb2N1c1wiLFxuICAgIFwiaXRlbXNjb3BlXCIsXG4gICAgXCJtdWx0aXBsZVwiLFxuICAgIFwibm92YWxpZGF0ZVwiLFxuICAgIFwiYWxsb3dmdWxsc2NyZWVuXCIsXG4gICAgXCJhbGxvd3BheW1lbnRyZXF1ZXN0XCIsXG4gICAgXCJmb3Jtbm92YWxpZGF0ZVwiLFxuICAgIFwiYXV0b3BsYXlcIixcbiAgICBcImNvbnRyb2xzXCIsXG4gICAgXCJsb29wXCIsXG4gICAgXCJtdXRlZFwiLFxuICAgIFwicGxheXNpbmxpbmVcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImlzbWFwXCIsXG4gICAgXCJyZXZlcnNlZFwiLFxuICAgIFwiYXN5bmNcIixcbiAgICBcImRlZmVyXCIsXG4gICAgXCJub21vZHVsZVwiXG4gIF07XG4gIHJldHVybiBib29sZWFuQXR0cmlidXRlcy5pbmNsdWRlcyhhdHRyTmFtZSk7XG59XG5mdW5jdGlvbiBhdHRyaWJ1dGVTaG91bGRudEJlUHJlc2VydmVkSWZGYWxzeShuYW1lKSB7XG4gIHJldHVybiAhW1wiYXJpYS1wcmVzc2VkXCIsIFwiYXJpYS1jaGVja2VkXCIsIFwiYXJpYS1leHBhbmRlZFwiLCBcImFyaWEtc2VsZWN0ZWRcIl0uaW5jbHVkZXMobmFtZSk7XG59XG5mdW5jdGlvbiBnZXRCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjaykge1xuICBpZiAoZWwuX3hfYmluZGluZ3MgJiYgZWwuX3hfYmluZGluZ3NbbmFtZV0gIT09IHZvaWQgMClcbiAgICByZXR1cm4gZWwuX3hfYmluZGluZ3NbbmFtZV07XG4gIGxldCBhdHRyID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICBpZiAoYXR0ciA9PT0gbnVsbClcbiAgICByZXR1cm4gdHlwZW9mIGZhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgPyBmYWxsYmFjaygpIDogZmFsbGJhY2s7XG4gIGlmIChhdHRyID09PSBcIlwiKVxuICAgIHJldHVybiB0cnVlO1xuICBpZiAoaXNCb29sZWFuQXR0cihuYW1lKSkge1xuICAgIHJldHVybiAhIVtuYW1lLCBcInRydWVcIl0uaW5jbHVkZXMoYXR0cik7XG4gIH1cbiAgcmV0dXJuIGF0dHI7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9kZWJvdW5jZS5qc1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy90aHJvdHRsZS5qc1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgbGltaXQpIHtcbiAgbGV0IGluVGhyb3R0bGU7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgaWYgKCFpblRocm90dGxlKSB7XG4gICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaW5UaHJvdHRsZSA9IHRydWU7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGluVGhyb3R0bGUgPSBmYWxzZSwgbGltaXQpO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3BsdWdpbi5qc1xuZnVuY3Rpb24gcGx1Z2luKGNhbGxiYWNrKSB7XG4gIGNhbGxiYWNrKGFscGluZV9kZWZhdWx0KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3N0b3JlLmpzXG52YXIgc3RvcmVzID0ge307XG52YXIgaXNSZWFjdGl2ZSA9IGZhbHNlO1xuZnVuY3Rpb24gc3RvcmUobmFtZSwgdmFsdWUpIHtcbiAgaWYgKCFpc1JlYWN0aXZlKSB7XG4gICAgc3RvcmVzID0gcmVhY3RpdmUoc3RvcmVzKTtcbiAgICBpc1JlYWN0aXZlID0gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBzdG9yZXNbbmFtZV07XG4gIH1cbiAgc3RvcmVzW25hbWVdID0gdmFsdWU7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoXCJpbml0XCIpICYmIHR5cGVvZiB2YWx1ZS5pbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBzdG9yZXNbbmFtZV0uaW5pdCgpO1xuICB9XG4gIGluaXRJbnRlcmNlcHRvcnMoc3RvcmVzW25hbWVdKTtcbn1cbmZ1bmN0aW9uIGdldFN0b3JlcygpIHtcbiAgcmV0dXJuIHN0b3Jlcztcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2JpbmRzLmpzXG52YXIgYmluZHMgPSB7fTtcbmZ1bmN0aW9uIGJpbmQyKG5hbWUsIGJpbmRpbmdzKSB7XG4gIGxldCBnZXRCaW5kaW5ncyA9IHR5cGVvZiBiaW5kaW5ncyAhPT0gXCJmdW5jdGlvblwiID8gKCkgPT4gYmluZGluZ3MgOiBiaW5kaW5ncztcbiAgaWYgKG5hbWUgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgYXBwbHlCaW5kaW5nc09iamVjdChuYW1lLCBnZXRCaW5kaW5ncygpKTtcbiAgfSBlbHNlIHtcbiAgICBiaW5kc1tuYW1lXSA9IGdldEJpbmRpbmdzO1xuICB9XG59XG5mdW5jdGlvbiBpbmplY3RCaW5kaW5nUHJvdmlkZXJzKG9iaikge1xuICBPYmplY3QuZW50cmllcyhiaW5kcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIGFwcGx5QmluZGluZ3NPYmplY3QoZWwsIG9iaiwgb3JpZ2luYWwpIHtcbiAgbGV0IGNsZWFudXBSdW5uZXJzID0gW107XG4gIHdoaWxlIChjbGVhbnVwUnVubmVycy5sZW5ndGgpXG4gICAgY2xlYW51cFJ1bm5lcnMucG9wKCkoKTtcbiAgbGV0IGF0dHJpYnV0ZXMgPSBPYmplY3QuZW50cmllcyhvYmopLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4gKHtuYW1lLCB2YWx1ZX0pKTtcbiAgbGV0IHN0YXRpY0F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzT25seShhdHRyaWJ1dGVzKTtcbiAgYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICBpZiAoc3RhdGljQXR0cmlidXRlcy5maW5kKChhdHRyKSA9PiBhdHRyLm5hbWUgPT09IGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYHgtYmluZDoke2F0dHJpYnV0ZS5uYW1lfWAsXG4gICAgICAgIHZhbHVlOiBgXCIke2F0dHJpYnV0ZS52YWx1ZX1cImBcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGU7XG4gIH0pO1xuICBkaXJlY3RpdmVzKGVsLCBhdHRyaWJ1dGVzLCBvcmlnaW5hbCkubWFwKChoYW5kbGUpID0+IHtcbiAgICBjbGVhbnVwUnVubmVycy5wdXNoKGhhbmRsZS5ydW5DbGVhbnVwcyk7XG4gICAgaGFuZGxlKCk7XG4gIH0pO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGF0YXMuanNcbnZhciBkYXRhcyA9IHt9O1xuZnVuY3Rpb24gZGF0YShuYW1lLCBjYWxsYmFjaykge1xuICBkYXRhc1tuYW1lXSA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gaW5qZWN0RGF0YVByb3ZpZGVycyhvYmosIGNvbnRleHQpIHtcbiAgT2JqZWN0LmVudHJpZXMoZGF0YXMpLmZvckVhY2goKFtuYW1lLCBjYWxsYmFja10pID0+IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjay5iaW5kKGNvbnRleHQpKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvYWxwaW5lLmpzXG52YXIgQWxwaW5lID0ge1xuICBnZXQgcmVhY3RpdmUoKSB7XG4gICAgcmV0dXJuIHJlYWN0aXZlO1xuICB9LFxuICBnZXQgcmVsZWFzZSgpIHtcbiAgICByZXR1cm4gcmVsZWFzZTtcbiAgfSxcbiAgZ2V0IGVmZmVjdCgpIHtcbiAgICByZXR1cm4gZWZmZWN0O1xuICB9LFxuICBnZXQgcmF3KCkge1xuICAgIHJldHVybiByYXc7XG4gIH0sXG4gIHZlcnNpb246IFwiMy4xMC41XCIsXG4gIGZsdXNoQW5kU3RvcERlZmVycmluZ011dGF0aW9ucyxcbiAgZG9udEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyxcbiAgZGlzYWJsZUVmZmVjdFNjaGVkdWxpbmcsXG4gIHNldFJlYWN0aXZpdHlFbmdpbmUsXG4gIGNsb3Nlc3REYXRhU3RhY2ssXG4gIHNraXBEdXJpbmdDbG9uZSxcbiAgYWRkUm9vdFNlbGVjdG9yLFxuICBhZGRJbml0U2VsZWN0b3IsXG4gIGFkZFNjb3BlVG9Ob2RlLFxuICBkZWZlck11dGF0aW9ucyxcbiAgbWFwQXR0cmlidXRlcyxcbiAgZXZhbHVhdGVMYXRlcixcbiAgc2V0RXZhbHVhdG9yLFxuICBtZXJnZVByb3hpZXMsXG4gIGZpbmRDbG9zZXN0LFxuICBjbG9zZXN0Um9vdCxcbiAgaW50ZXJjZXB0b3IsXG4gIHRyYW5zaXRpb24sXG4gIHNldFN0eWxlcyxcbiAgbXV0YXRlRG9tLFxuICBkaXJlY3RpdmUsXG4gIHRocm90dGxlLFxuICBkZWJvdW5jZSxcbiAgZXZhbHVhdGUsXG4gIGluaXRUcmVlLFxuICBuZXh0VGljayxcbiAgcHJlZml4ZWQ6IHByZWZpeCxcbiAgcHJlZml4OiBzZXRQcmVmaXgsXG4gIHBsdWdpbixcbiAgbWFnaWMsXG4gIHN0b3JlLFxuICBzdGFydCxcbiAgY2xvbmUsXG4gIGJvdW5kOiBnZXRCaW5kaW5nLFxuICAkZGF0YTogc2NvcGUsXG4gIGRhdGEsXG4gIGJpbmQ6IGJpbmQyXG59O1xudmFyIGFscGluZV9kZWZhdWx0ID0gQWxwaW5lO1xuXG4vLyBub2RlX21vZHVsZXMvQHZ1ZS9zaGFyZWQvZGlzdC9zaGFyZWQuZXNtLWJ1bmRsZXIuanNcbmZ1bmN0aW9uIG1ha2VNYXAoc3RyLCBleHBlY3RzTG93ZXJDYXNlKSB7XG4gIGNvbnN0IG1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGNvbnN0IGxpc3QgPSBzdHIuc3BsaXQoXCIsXCIpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBtYXBbbGlzdFtpXV0gPSB0cnVlO1xuICB9XG4gIHJldHVybiBleHBlY3RzTG93ZXJDYXNlID8gKHZhbCkgPT4gISFtYXBbdmFsLnRvTG93ZXJDYXNlKCldIDogKHZhbCkgPT4gISFtYXBbdmFsXTtcbn1cbnZhciBQYXRjaEZsYWdOYW1lcyA9IHtcbiAgWzFdOiBgVEVYVGAsXG4gIFsyXTogYENMQVNTYCxcbiAgWzRdOiBgU1RZTEVgLFxuICBbOF06IGBQUk9QU2AsXG4gIFsxNl06IGBGVUxMX1BST1BTYCxcbiAgWzMyXTogYEhZRFJBVEVfRVZFTlRTYCxcbiAgWzY0XTogYFNUQUJMRV9GUkFHTUVOVGAsXG4gIFsxMjhdOiBgS0VZRURfRlJBR01FTlRgLFxuICBbMjU2XTogYFVOS0VZRURfRlJBR01FTlRgLFxuICBbNTEyXTogYE5FRURfUEFUQ0hgLFxuICBbMTAyNF06IGBEWU5BTUlDX1NMT1RTYCxcbiAgWzIwNDhdOiBgREVWX1JPT1RfRlJBR01FTlRgLFxuICBbLTFdOiBgSE9JU1RFRGAsXG4gIFstMl06IGBCQUlMYFxufTtcbnZhciBzbG90RmxhZ3NUZXh0ID0ge1xuICBbMV06IFwiU1RBQkxFXCIsXG4gIFsyXTogXCJEWU5BTUlDXCIsXG4gIFszXTogXCJGT1JXQVJERURcIlxufTtcbnZhciBzcGVjaWFsQm9vbGVhbkF0dHJzID0gYGl0ZW1zY29wZSxhbGxvd2Z1bGxzY3JlZW4sZm9ybW5vdmFsaWRhdGUsaXNtYXAsbm9tb2R1bGUsbm92YWxpZGF0ZSxyZWFkb25seWA7XG52YXIgaXNCb29sZWFuQXR0cjIgPSAvKiBAX19QVVJFX18gKi8gbWFrZU1hcChzcGVjaWFsQm9vbGVhbkF0dHJzICsgYCxhc3luYyxhdXRvZm9jdXMsYXV0b3BsYXksY29udHJvbHMsZGVmYXVsdCxkZWZlcixkaXNhYmxlZCxoaWRkZW4sbG9vcCxvcGVuLHJlcXVpcmVkLHJldmVyc2VkLHNjb3BlZCxzZWFtbGVzcyxjaGVja2VkLG11dGVkLG11bHRpcGxlLHNlbGVjdGVkYCk7XG52YXIgRU1QVFlfT0JKID0gdHJ1ZSA/IE9iamVjdC5mcmVlemUoe30pIDoge307XG52YXIgRU1QVFlfQVJSID0gdHJ1ZSA/IE9iamVjdC5mcmVlemUoW10pIDogW107XG52YXIgZXh0ZW5kID0gT2JqZWN0LmFzc2lnbjtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaGFzT3duID0gKHZhbCwga2V5KSA9PiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbCwga2V5KTtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbnZhciBpc01hcCA9ICh2YWwpID0+IHRvVHlwZVN0cmluZyh2YWwpID09PSBcIltvYmplY3QgTWFwXVwiO1xudmFyIGlzU3RyaW5nID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIjtcbnZhciBpc1N5bWJvbCA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwic3ltYm9sXCI7XG52YXIgaXNPYmplY3QgPSAodmFsKSA9PiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIjtcbnZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgdG9UeXBlU3RyaW5nID0gKHZhbHVlKSA9PiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbnZhciB0b1Jhd1R5cGUgPSAodmFsdWUpID0+IHtcbiAgcmV0dXJuIHRvVHlwZVN0cmluZyh2YWx1ZSkuc2xpY2UoOCwgLTEpO1xufTtcbnZhciBpc0ludGVnZXJLZXkgPSAoa2V5KSA9PiBpc1N0cmluZyhrZXkpICYmIGtleSAhPT0gXCJOYU5cIiAmJiBrZXlbMF0gIT09IFwiLVwiICYmIFwiXCIgKyBwYXJzZUludChrZXksIDEwKSA9PT0ga2V5O1xudmFyIGNhY2hlU3RyaW5nRnVuY3Rpb24gPSAoZm4pID0+IHtcbiAgY29uc3QgY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gKHN0cikgPT4ge1xuICAgIGNvbnN0IGhpdCA9IGNhY2hlW3N0cl07XG4gICAgcmV0dXJuIGhpdCB8fCAoY2FjaGVbc3RyXSA9IGZuKHN0cikpO1xuICB9O1xufTtcbnZhciBjYW1lbGl6ZVJFID0gLy0oXFx3KS9nO1xudmFyIGNhbWVsaXplID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbGl6ZVJFLCAoXywgYykgPT4gYyA/IGMudG9VcHBlckNhc2UoKSA6IFwiXCIpO1xufSk7XG52YXIgaHlwaGVuYXRlUkUgPSAvXFxCKFtBLVpdKS9nO1xudmFyIGh5cGhlbmF0ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4gc3RyLnJlcGxhY2UoaHlwaGVuYXRlUkUsIFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpO1xudmFyIGNhcGl0YWxpemUgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKSk7XG52YXIgdG9IYW5kbGVyS2V5ID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiBzdHIgPyBgb24ke2NhcGl0YWxpemUoc3RyKX1gIDogYGApO1xudmFyIGhhc0NoYW5nZWQgPSAodmFsdWUsIG9sZFZhbHVlKSA9PiB2YWx1ZSAhPT0gb2xkVmFsdWUgJiYgKHZhbHVlID09PSB2YWx1ZSB8fCBvbGRWYWx1ZSA9PT0gb2xkVmFsdWUpO1xuXG4vLyBub2RlX21vZHVsZXMvQHZ1ZS9yZWFjdGl2aXR5L2Rpc3QvcmVhY3Rpdml0eS5lc20tYnVuZGxlci5qc1xudmFyIHRhcmdldE1hcCA9IG5ldyBXZWFrTWFwKCk7XG52YXIgZWZmZWN0U3RhY2sgPSBbXTtcbnZhciBhY3RpdmVFZmZlY3Q7XG52YXIgSVRFUkFURV9LRVkgPSBTeW1ib2wodHJ1ZSA/IFwiaXRlcmF0ZVwiIDogXCJcIik7XG52YXIgTUFQX0tFWV9JVEVSQVRFX0tFWSA9IFN5bWJvbCh0cnVlID8gXCJNYXAga2V5IGl0ZXJhdGVcIiA6IFwiXCIpO1xuZnVuY3Rpb24gaXNFZmZlY3QoZm4pIHtcbiAgcmV0dXJuIGZuICYmIGZuLl9pc0VmZmVjdCA9PT0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGVmZmVjdDIoZm4sIG9wdGlvbnMgPSBFTVBUWV9PQkopIHtcbiAgaWYgKGlzRWZmZWN0KGZuKSkge1xuICAgIGZuID0gZm4ucmF3O1xuICB9XG4gIGNvbnN0IGVmZmVjdDMgPSBjcmVhdGVSZWFjdGl2ZUVmZmVjdChmbiwgb3B0aW9ucyk7XG4gIGlmICghb3B0aW9ucy5sYXp5KSB7XG4gICAgZWZmZWN0MygpO1xuICB9XG4gIHJldHVybiBlZmZlY3QzO1xufVxuZnVuY3Rpb24gc3RvcChlZmZlY3QzKSB7XG4gIGlmIChlZmZlY3QzLmFjdGl2ZSkge1xuICAgIGNsZWFudXAoZWZmZWN0Myk7XG4gICAgaWYgKGVmZmVjdDMub3B0aW9ucy5vblN0b3ApIHtcbiAgICAgIGVmZmVjdDMub3B0aW9ucy5vblN0b3AoKTtcbiAgICB9XG4gICAgZWZmZWN0My5hY3RpdmUgPSBmYWxzZTtcbiAgfVxufVxudmFyIHVpZCA9IDA7XG5mdW5jdGlvbiBjcmVhdGVSZWFjdGl2ZUVmZmVjdChmbiwgb3B0aW9ucykge1xuICBjb25zdCBlZmZlY3QzID0gZnVuY3Rpb24gcmVhY3RpdmVFZmZlY3QoKSB7XG4gICAgaWYgKCFlZmZlY3QzLmFjdGl2ZSkge1xuICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfVxuICAgIGlmICghZWZmZWN0U3RhY2suaW5jbHVkZXMoZWZmZWN0MykpIHtcbiAgICAgIGNsZWFudXAoZWZmZWN0Myk7XG4gICAgICB0cnkge1xuICAgICAgICBlbmFibGVUcmFja2luZygpO1xuICAgICAgICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdDMpO1xuICAgICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3QzO1xuICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgICAgICByZXNldFRyYWNraW5nKCk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgZWZmZWN0My5pZCA9IHVpZCsrO1xuICBlZmZlY3QzLmFsbG93UmVjdXJzZSA9ICEhb3B0aW9ucy5hbGxvd1JlY3Vyc2U7XG4gIGVmZmVjdDMuX2lzRWZmZWN0ID0gdHJ1ZTtcbiAgZWZmZWN0My5hY3RpdmUgPSB0cnVlO1xuICBlZmZlY3QzLnJhdyA9IGZuO1xuICBlZmZlY3QzLmRlcHMgPSBbXTtcbiAgZWZmZWN0My5vcHRpb25zID0gb3B0aW9ucztcbiAgcmV0dXJuIGVmZmVjdDM7XG59XG5mdW5jdGlvbiBjbGVhbnVwKGVmZmVjdDMpIHtcbiAgY29uc3Qge2RlcHN9ID0gZWZmZWN0MztcbiAgaWYgKGRlcHMubGVuZ3RoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkZXBzW2ldLmRlbGV0ZShlZmZlY3QzKTtcbiAgICB9XG4gICAgZGVwcy5sZW5ndGggPSAwO1xuICB9XG59XG52YXIgc2hvdWxkVHJhY2sgPSB0cnVlO1xudmFyIHRyYWNrU3RhY2sgPSBbXTtcbmZ1bmN0aW9uIHBhdXNlVHJhY2tpbmcoKSB7XG4gIHRyYWNrU3RhY2sucHVzaChzaG91bGRUcmFjayk7XG4gIHNob3VsZFRyYWNrID0gZmFsc2U7XG59XG5mdW5jdGlvbiBlbmFibGVUcmFja2luZygpIHtcbiAgdHJhY2tTdGFjay5wdXNoKHNob3VsZFRyYWNrKTtcbiAgc2hvdWxkVHJhY2sgPSB0cnVlO1xufVxuZnVuY3Rpb24gcmVzZXRUcmFja2luZygpIHtcbiAgY29uc3QgbGFzdCA9IHRyYWNrU3RhY2sucG9wKCk7XG4gIHNob3VsZFRyYWNrID0gbGFzdCA9PT0gdm9pZCAwID8gdHJ1ZSA6IGxhc3Q7XG59XG5mdW5jdGlvbiB0cmFjayh0YXJnZXQsIHR5cGUsIGtleSkge1xuICBpZiAoIXNob3VsZFRyYWNrIHx8IGFjdGl2ZUVmZmVjdCA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBkZXBzTWFwID0gdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoIWRlcHNNYXApIHtcbiAgICB0YXJnZXRNYXAuc2V0KHRhcmdldCwgZGVwc01hcCA9IG5ldyBNYXAoKSk7XG4gIH1cbiAgbGV0IGRlcCA9IGRlcHNNYXAuZ2V0KGtleSk7XG4gIGlmICghZGVwKSB7XG4gICAgZGVwc01hcC5zZXQoa2V5LCBkZXAgPSBuZXcgU2V0KCkpO1xuICB9XG4gIGlmICghZGVwLmhhcyhhY3RpdmVFZmZlY3QpKSB7XG4gICAgZGVwLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgIGFjdGl2ZUVmZmVjdC5kZXBzLnB1c2goZGVwKTtcbiAgICBpZiAoYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjaykge1xuICAgICAgYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjayh7XG4gICAgICAgIGVmZmVjdDogYWN0aXZlRWZmZWN0LFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGtleVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiB0cmlnZ2VyKHRhcmdldCwgdHlwZSwga2V5LCBuZXdWYWx1ZSwgb2xkVmFsdWUsIG9sZFRhcmdldCkge1xuICBjb25zdCBkZXBzTWFwID0gdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoIWRlcHNNYXApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZWZmZWN0cyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgYWRkMiA9IChlZmZlY3RzVG9BZGQpID0+IHtcbiAgICBpZiAoZWZmZWN0c1RvQWRkKSB7XG4gICAgICBlZmZlY3RzVG9BZGQuZm9yRWFjaCgoZWZmZWN0MykgPT4ge1xuICAgICAgICBpZiAoZWZmZWN0MyAhPT0gYWN0aXZlRWZmZWN0IHx8IGVmZmVjdDMuYWxsb3dSZWN1cnNlKSB7XG4gICAgICAgICAgZWZmZWN0cy5hZGQoZWZmZWN0Myk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgaWYgKHR5cGUgPT09IFwiY2xlYXJcIikge1xuICAgIGRlcHNNYXAuZm9yRWFjaChhZGQyKTtcbiAgfSBlbHNlIGlmIChrZXkgPT09IFwibGVuZ3RoXCIgJiYgaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgZGVwc01hcC5mb3JFYWNoKChkZXAsIGtleTIpID0+IHtcbiAgICAgIGlmIChrZXkyID09PSBcImxlbmd0aFwiIHx8IGtleTIgPj0gbmV3VmFsdWUpIHtcbiAgICAgICAgYWRkMihkZXApO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGlmIChrZXkgIT09IHZvaWQgMCkge1xuICAgICAgYWRkMihkZXBzTWFwLmdldChrZXkpKTtcbiAgICB9XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFwiYWRkXCI6XG4gICAgICAgIGlmICghaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KE1BUF9LRVlfSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJbnRlZ2VyS2V5KGtleSkpIHtcbiAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KFwibGVuZ3RoXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkZWxldGVcIjpcbiAgICAgICAgaWYgKCFpc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KElURVJBVEVfS0VZKSk7XG4gICAgICAgICAgaWYgKGlzTWFwKHRhcmdldCkpIHtcbiAgICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoTUFQX0tFWV9JVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzZXRcIjpcbiAgICAgICAgaWYgKGlzTWFwKHRhcmdldCkpIHtcbiAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KElURVJBVEVfS0VZKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGNvbnN0IHJ1biA9IChlZmZlY3QzKSA9PiB7XG4gICAgaWYgKGVmZmVjdDMub3B0aW9ucy5vblRyaWdnZXIpIHtcbiAgICAgIGVmZmVjdDMub3B0aW9ucy5vblRyaWdnZXIoe1xuICAgICAgICBlZmZlY3Q6IGVmZmVjdDMsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAga2V5LFxuICAgICAgICB0eXBlLFxuICAgICAgICBuZXdWYWx1ZSxcbiAgICAgICAgb2xkVmFsdWUsXG4gICAgICAgIG9sZFRhcmdldFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChlZmZlY3QzLm9wdGlvbnMuc2NoZWR1bGVyKSB7XG4gICAgICBlZmZlY3QzLm9wdGlvbnMuc2NoZWR1bGVyKGVmZmVjdDMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlZmZlY3QzKCk7XG4gICAgfVxuICB9O1xuICBlZmZlY3RzLmZvckVhY2gocnVuKTtcbn1cbnZhciBpc05vblRyYWNrYWJsZUtleXMgPSAvKiBAX19QVVJFX18gKi8gbWFrZU1hcChgX19wcm90b19fLF9fdl9pc1JlZixfX2lzVnVlYCk7XG52YXIgYnVpbHRJblN5bWJvbHMgPSBuZXcgU2V0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKFN5bWJvbCkubWFwKChrZXkpID0+IFN5bWJvbFtrZXldKS5maWx0ZXIoaXNTeW1ib2wpKTtcbnZhciBnZXQyID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUdldHRlcigpO1xudmFyIHNoYWxsb3dHZXQgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlR2V0dGVyKGZhbHNlLCB0cnVlKTtcbnZhciByZWFkb25seUdldCA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIodHJ1ZSk7XG52YXIgc2hhbGxvd1JlYWRvbmx5R2V0ID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUdldHRlcih0cnVlLCB0cnVlKTtcbnZhciBhcnJheUluc3RydW1lbnRhdGlvbnMgPSB7fTtcbltcImluY2x1ZGVzXCIsIFwiaW5kZXhPZlwiLCBcImxhc3RJbmRleE9mXCJdLmZvckVhY2goKGtleSkgPT4ge1xuICBjb25zdCBtZXRob2QgPSBBcnJheS5wcm90b3R5cGVba2V5XTtcbiAgYXJyYXlJbnN0cnVtZW50YXRpb25zW2tleV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgY29uc3QgYXJyID0gdG9SYXcodGhpcyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdHJhY2soYXJyLCBcImdldFwiLCBpICsgXCJcIik7XG4gICAgfVxuICAgIGNvbnN0IHJlcyA9IG1ldGhvZC5hcHBseShhcnIsIGFyZ3MpO1xuICAgIGlmIChyZXMgPT09IC0xIHx8IHJlcyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuYXBwbHkoYXJyLCBhcmdzLm1hcCh0b1JhdykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgfTtcbn0pO1xuW1wicHVzaFwiLCBcInBvcFwiLCBcInNoaWZ0XCIsIFwidW5zaGlmdFwiLCBcInNwbGljZVwiXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgY29uc3QgbWV0aG9kID0gQXJyYXkucHJvdG90eXBlW2tleV07XG4gIGFycmF5SW5zdHJ1bWVudGF0aW9uc1trZXldID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIHBhdXNlVHJhY2tpbmcoKTtcbiAgICBjb25zdCByZXMgPSBtZXRob2QuYXBwbHkodGhpcywgYXJncyk7XG4gICAgcmVzZXRUcmFja2luZygpO1xuICAgIHJldHVybiByZXM7XG4gIH07XG59KTtcbmZ1bmN0aW9uIGNyZWF0ZUdldHRlcihpc1JlYWRvbmx5ID0gZmFsc2UsIHNoYWxsb3cgPSBmYWxzZSkge1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0Myh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWN0aXZlXCIpIHtcbiAgICAgIHJldHVybiAhaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFkb25seVwiKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfcmF3XCIgJiYgcmVjZWl2ZXIgPT09IChpc1JlYWRvbmx5ID8gc2hhbGxvdyA/IHNoYWxsb3dSZWFkb25seU1hcCA6IHJlYWRvbmx5TWFwIDogc2hhbGxvdyA/IHNoYWxsb3dSZWFjdGl2ZU1hcCA6IHJlYWN0aXZlTWFwKS5nZXQodGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0SXNBcnJheSA9IGlzQXJyYXkodGFyZ2V0KTtcbiAgICBpZiAoIWlzUmVhZG9ubHkgJiYgdGFyZ2V0SXNBcnJheSAmJiBoYXNPd24oYXJyYXlJbnN0cnVtZW50YXRpb25zLCBrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXQoYXJyYXlJbnN0cnVtZW50YXRpb25zLCBrZXksIHJlY2VpdmVyKTtcbiAgICB9XG4gICAgY29uc3QgcmVzID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKTtcbiAgICBpZiAoaXNTeW1ib2woa2V5KSA/IGJ1aWx0SW5TeW1ib2xzLmhhcyhrZXkpIDogaXNOb25UcmFja2FibGVLZXlzKGtleSkpIHtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGlmICghaXNSZWFkb25seSkge1xuICAgICAgdHJhY2sodGFyZ2V0LCBcImdldFwiLCBrZXkpO1xuICAgIH1cbiAgICBpZiAoc2hhbGxvdykge1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgaWYgKGlzUmVmKHJlcykpIHtcbiAgICAgIGNvbnN0IHNob3VsZFVud3JhcCA9ICF0YXJnZXRJc0FycmF5IHx8ICFpc0ludGVnZXJLZXkoa2V5KTtcbiAgICAgIHJldHVybiBzaG91bGRVbndyYXAgPyByZXMudmFsdWUgOiByZXM7XG4gICAgfVxuICAgIGlmIChpc09iamVjdChyZXMpKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seSA/IHJlYWRvbmx5KHJlcykgOiByZWFjdGl2ZTIocmVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbn1cbnZhciBzZXQyID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZVNldHRlcigpO1xudmFyIHNoYWxsb3dTZXQgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlU2V0dGVyKHRydWUpO1xuZnVuY3Rpb24gY3JlYXRlU2V0dGVyKHNoYWxsb3cgPSBmYWxzZSkge1xuICByZXR1cm4gZnVuY3Rpb24gc2V0Myh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgbGV0IG9sZFZhbHVlID0gdGFyZ2V0W2tleV07XG4gICAgaWYgKCFzaGFsbG93KSB7XG4gICAgICB2YWx1ZSA9IHRvUmF3KHZhbHVlKTtcbiAgICAgIG9sZFZhbHVlID0gdG9SYXcob2xkVmFsdWUpO1xuICAgICAgaWYgKCFpc0FycmF5KHRhcmdldCkgJiYgaXNSZWYob2xkVmFsdWUpICYmICFpc1JlZih2YWx1ZSkpIHtcbiAgICAgICAgb2xkVmFsdWUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGhhZEtleSA9IGlzQXJyYXkodGFyZ2V0KSAmJiBpc0ludGVnZXJLZXkoa2V5KSA/IE51bWJlcihrZXkpIDwgdGFyZ2V0Lmxlbmd0aCA6IGhhc093bih0YXJnZXQsIGtleSk7XG4gICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcik7XG4gICAgaWYgKHRhcmdldCA9PT0gdG9SYXcocmVjZWl2ZXIpKSB7XG4gICAgICBpZiAoIWhhZEtleSkge1xuICAgICAgICB0cmlnZ2VyKHRhcmdldCwgXCJhZGRcIiwga2V5LCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGhhc0NoYW5nZWQodmFsdWUsIG9sZFZhbHVlKSkge1xuICAgICAgICB0cmlnZ2VyKHRhcmdldCwgXCJzZXRcIiwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuZnVuY3Rpb24gZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcbiAgY29uc3QgaGFkS2V5ID0gaGFzT3duKHRhcmdldCwga2V5KTtcbiAgY29uc3Qgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG4gIGlmIChyZXN1bHQgJiYgaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiZGVsZXRlXCIsIGtleSwgdm9pZCAwLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGhhcyh0YXJnZXQsIGtleSkge1xuICBjb25zdCByZXN1bHQgPSBSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSk7XG4gIGlmICghaXNTeW1ib2woa2V5KSB8fCAhYnVpbHRJblN5bWJvbHMuaGFzKGtleSkpIHtcbiAgICB0cmFjayh0YXJnZXQsIFwiaGFzXCIsIGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG93bktleXModGFyZ2V0KSB7XG4gIHRyYWNrKHRhcmdldCwgXCJpdGVyYXRlXCIsIGlzQXJyYXkodGFyZ2V0KSA/IFwibGVuZ3RoXCIgOiBJVEVSQVRFX0tFWSk7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcbn1cbnZhciBtdXRhYmxlSGFuZGxlcnMgPSB7XG4gIGdldDogZ2V0MixcbiAgc2V0OiBzZXQyLFxuICBkZWxldGVQcm9wZXJ0eSxcbiAgaGFzLFxuICBvd25LZXlzXG59O1xudmFyIHJlYWRvbmx5SGFuZGxlcnMgPSB7XG4gIGdldDogcmVhZG9ubHlHZXQsXG4gIHNldCh0YXJnZXQsIGtleSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFNldCBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcoa2V5KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgY29uc29sZS53YXJuKGBEZWxldGUgb3BlcmF0aW9uIG9uIGtleSBcIiR7U3RyaW5nKGtleSl9XCIgZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCwgdGFyZ2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG52YXIgc2hhbGxvd1JlYWN0aXZlSGFuZGxlcnMgPSBleHRlbmQoe30sIG11dGFibGVIYW5kbGVycywge1xuICBnZXQ6IHNoYWxsb3dHZXQsXG4gIHNldDogc2hhbGxvd1NldFxufSk7XG52YXIgc2hhbGxvd1JlYWRvbmx5SGFuZGxlcnMgPSBleHRlbmQoe30sIHJlYWRvbmx5SGFuZGxlcnMsIHtcbiAgZ2V0OiBzaGFsbG93UmVhZG9ubHlHZXRcbn0pO1xudmFyIHRvUmVhY3RpdmUgPSAodmFsdWUpID0+IGlzT2JqZWN0KHZhbHVlKSA/IHJlYWN0aXZlMih2YWx1ZSkgOiB2YWx1ZTtcbnZhciB0b1JlYWRvbmx5ID0gKHZhbHVlKSA9PiBpc09iamVjdCh2YWx1ZSkgPyByZWFkb25seSh2YWx1ZSkgOiB2YWx1ZTtcbnZhciB0b1NoYWxsb3cgPSAodmFsdWUpID0+IHZhbHVlO1xudmFyIGdldFByb3RvID0gKHYpID0+IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2Yodik7XG5mdW5jdGlvbiBnZXQkMSh0YXJnZXQsIGtleSwgaXNSZWFkb25seSA9IGZhbHNlLCBpc1NoYWxsb3cgPSBmYWxzZSkge1xuICB0YXJnZXQgPSB0YXJnZXRbXCJfX3ZfcmF3XCJdO1xuICBjb25zdCByYXdUYXJnZXQgPSB0b1Jhdyh0YXJnZXQpO1xuICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xuICBpZiAoa2V5ICE9PSByYXdLZXkpIHtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiZ2V0XCIsIGtleSk7XG4gIH1cbiAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcImdldFwiLCByYXdLZXkpO1xuICBjb25zdCB7aGFzOiBoYXMyfSA9IGdldFByb3RvKHJhd1RhcmdldCk7XG4gIGNvbnN0IHdyYXAgPSBpc1NoYWxsb3cgPyB0b1NoYWxsb3cgOiBpc1JlYWRvbmx5ID8gdG9SZWFkb25seSA6IHRvUmVhY3RpdmU7XG4gIGlmIChoYXMyLmNhbGwocmF3VGFyZ2V0LCBrZXkpKSB7XG4gICAgcmV0dXJuIHdyYXAodGFyZ2V0LmdldChrZXkpKTtcbiAgfSBlbHNlIGlmIChoYXMyLmNhbGwocmF3VGFyZ2V0LCByYXdLZXkpKSB7XG4gICAgcmV0dXJuIHdyYXAodGFyZ2V0LmdldChyYXdLZXkpKTtcbiAgfSBlbHNlIGlmICh0YXJnZXQgIT09IHJhd1RhcmdldCkge1xuICAgIHRhcmdldC5nZXQoa2V5KTtcbiAgfVxufVxuZnVuY3Rpb24gaGFzJDEoa2V5LCBpc1JlYWRvbmx5ID0gZmFsc2UpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdGhpc1tcIl9fdl9yYXdcIl07XG4gIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XG4gIGlmIChrZXkgIT09IHJhd0tleSkge1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJoYXNcIiwga2V5KTtcbiAgfVxuICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaGFzXCIsIHJhd0tleSk7XG4gIHJldHVybiBrZXkgPT09IHJhd0tleSA/IHRhcmdldC5oYXMoa2V5KSA6IHRhcmdldC5oYXMoa2V5KSB8fCB0YXJnZXQuaGFzKHJhd0tleSk7XG59XG5mdW5jdGlvbiBzaXplKHRhcmdldCwgaXNSZWFkb25seSA9IGZhbHNlKSB7XG4gIHRhcmdldCA9IHRhcmdldFtcIl9fdl9yYXdcIl07XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHRvUmF3KHRhcmdldCksIFwiaXRlcmF0ZVwiLCBJVEVSQVRFX0tFWSk7XG4gIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIFwic2l6ZVwiLCB0YXJnZXQpO1xufVxuZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcbiAgY29uc3QgcHJvdG8gPSBnZXRQcm90byh0YXJnZXQpO1xuICBjb25zdCBoYWRLZXkgPSBwcm90by5oYXMuY2FsbCh0YXJnZXQsIHZhbHVlKTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICB0YXJnZXQuYWRkKHZhbHVlKTtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJhZGRcIiwgdmFsdWUsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbmZ1bmN0aW9uIHNldCQxKGtleSwgdmFsdWUpIHtcbiAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCB7aGFzOiBoYXMyLCBnZXQ6IGdldDN9ID0gZ2V0UHJvdG8odGFyZ2V0KTtcbiAgbGV0IGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAga2V5ID0gdG9SYXcoa2V5KTtcbiAgICBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICB9IGVsc2UgaWYgKHRydWUpIHtcbiAgICBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSk7XG4gIH1cbiAgY29uc3Qgb2xkVmFsdWUgPSBnZXQzLmNhbGwodGFyZ2V0LCBrZXkpO1xuICB0YXJnZXQuc2V0KGtleSwgdmFsdWUpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCBrZXksIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChoYXNDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJzZXRcIiwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuZnVuY3Rpb24gZGVsZXRlRW50cnkoa2V5KSB7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCB7aGFzOiBoYXMyLCBnZXQ6IGdldDN9ID0gZ2V0UHJvdG8odGFyZ2V0KTtcbiAgbGV0IGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAga2V5ID0gdG9SYXcoa2V5KTtcbiAgICBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICB9IGVsc2UgaWYgKHRydWUpIHtcbiAgICBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSk7XG4gIH1cbiAgY29uc3Qgb2xkVmFsdWUgPSBnZXQzID8gZ2V0My5jYWxsKHRhcmdldCwga2V5KSA6IHZvaWQgMDtcbiAgY29uc3QgcmVzdWx0ID0gdGFyZ2V0LmRlbGV0ZShrZXkpO1xuICBpZiAoaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiZGVsZXRlXCIsIGtleSwgdm9pZCAwLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcbiAgY29uc3QgaGFkSXRlbXMgPSB0YXJnZXQuc2l6ZSAhPT0gMDtcbiAgY29uc3Qgb2xkVGFyZ2V0ID0gdHJ1ZSA/IGlzTWFwKHRhcmdldCkgPyBuZXcgTWFwKHRhcmdldCkgOiBuZXcgU2V0KHRhcmdldCkgOiB2b2lkIDA7XG4gIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5jbGVhcigpO1xuICBpZiAoaGFkSXRlbXMpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJjbGVhclwiLCB2b2lkIDAsIHZvaWQgMCwgb2xkVGFyZ2V0KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY3JlYXRlRm9yRWFjaChpc1JlYWRvbmx5LCBpc1NoYWxsb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBjb25zdCBvYnNlcnZlZCA9IHRoaXM7XG4gICAgY29uc3QgdGFyZ2V0ID0gb2JzZXJ2ZWRbXCJfX3ZfcmF3XCJdO1xuICAgIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gICAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaXRlcmF0ZVwiLCBJVEVSQVRFX0tFWSk7XG4gICAgcmV0dXJuIHRhcmdldC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICByZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB3cmFwKHZhbHVlKSwgd3JhcChrZXkpLCBvYnNlcnZlZCk7XG4gICAgfSk7XG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIGlzUmVhZG9ubHksIGlzU2hhbGxvdykge1xuICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXNbXCJfX3ZfcmF3XCJdO1xuICAgIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gICAgY29uc3QgdGFyZ2V0SXNNYXAgPSBpc01hcChyYXdUYXJnZXQpO1xuICAgIGNvbnN0IGlzUGFpciA9IG1ldGhvZCA9PT0gXCJlbnRyaWVzXCIgfHwgbWV0aG9kID09PSBTeW1ib2wuaXRlcmF0b3IgJiYgdGFyZ2V0SXNNYXA7XG4gICAgY29uc3QgaXNLZXlPbmx5ID0gbWV0aG9kID09PSBcImtleXNcIiAmJiB0YXJnZXRJc01hcDtcbiAgICBjb25zdCBpbm5lckl0ZXJhdG9yID0gdGFyZ2V0W21ldGhvZF0oLi4uYXJncyk7XG4gICAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaXRlcmF0ZVwiLCBpc0tleU9ubHkgPyBNQVBfS0VZX0lURVJBVEVfS0VZIDogSVRFUkFURV9LRVkpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0KCkge1xuICAgICAgICBjb25zdCB7dmFsdWUsIGRvbmV9ID0gaW5uZXJJdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBkb25lID8ge3ZhbHVlLCBkb25lfSA6IHtcbiAgICAgICAgICB2YWx1ZTogaXNQYWlyID8gW3dyYXAodmFsdWVbMF0pLCB3cmFwKHZhbHVlWzFdKV0gOiB3cmFwKHZhbHVlKSxcbiAgICAgICAgICBkb25lXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVSZWFkb25seU1ldGhvZCh0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZ3NbMF0gPyBgb24ga2V5IFwiJHthcmdzWzBdfVwiIGAgOiBgYDtcbiAgICAgIGNvbnNvbGUud2FybihgJHtjYXBpdGFsaXplKHR5cGUpfSBvcGVyYXRpb24gJHtrZXl9ZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCwgdG9SYXcodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZSA9PT0gXCJkZWxldGVcIiA/IGZhbHNlIDogdGhpcztcbiAgfTtcbn1cbnZhciBtdXRhYmxlSW5zdHJ1bWVudGF0aW9ucyA9IHtcbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXkpO1xuICB9LFxuICBnZXQgc2l6ZSgpIHtcbiAgICByZXR1cm4gc2l6ZSh0aGlzKTtcbiAgfSxcbiAgaGFzOiBoYXMkMSxcbiAgYWRkLFxuICBzZXQ6IHNldCQxLFxuICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxuICBjbGVhcixcbiAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaChmYWxzZSwgZmFsc2UpXG59O1xudmFyIHNoYWxsb3dJbnN0cnVtZW50YXRpb25zID0ge1xuICBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSwgZmFsc2UsIHRydWUpO1xuICB9LFxuICBnZXQgc2l6ZSgpIHtcbiAgICByZXR1cm4gc2l6ZSh0aGlzKTtcbiAgfSxcbiAgaGFzOiBoYXMkMSxcbiAgYWRkLFxuICBzZXQ6IHNldCQxLFxuICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxuICBjbGVhcixcbiAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaChmYWxzZSwgdHJ1ZSlcbn07XG52YXIgcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zID0ge1xuICBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSwgdHJ1ZSk7XG4gIH0sXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiBzaXplKHRoaXMsIHRydWUpO1xuICB9LFxuICBoYXMoa2V5KSB7XG4gICAgcmV0dXJuIGhhcyQxLmNhbGwodGhpcywga2V5LCB0cnVlKTtcbiAgfSxcbiAgYWRkOiBjcmVhdGVSZWFkb25seU1ldGhvZChcImFkZFwiKSxcbiAgc2V0OiBjcmVhdGVSZWFkb25seU1ldGhvZChcInNldFwiKSxcbiAgZGVsZXRlOiBjcmVhdGVSZWFkb25seU1ldGhvZChcImRlbGV0ZVwiKSxcbiAgY2xlYXI6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwiY2xlYXJcIiksXG4gIGZvckVhY2g6IGNyZWF0ZUZvckVhY2godHJ1ZSwgZmFsc2UpXG59O1xudmFyIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMgPSB7XG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5LCB0cnVlLCB0cnVlKTtcbiAgfSxcbiAgZ2V0IHNpemUoKSB7XG4gICAgcmV0dXJuIHNpemUodGhpcywgdHJ1ZSk7XG4gIH0sXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gaGFzJDEuY2FsbCh0aGlzLCBrZXksIHRydWUpO1xuICB9LFxuICBhZGQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwiYWRkXCIpLFxuICBzZXQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwic2V0XCIpLFxuICBkZWxldGU6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwiZGVsZXRlXCIpLFxuICBjbGVhcjogY3JlYXRlUmVhZG9ubHlNZXRob2QoXCJjbGVhclwiKSxcbiAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaCh0cnVlLCB0cnVlKVxufTtcbnZhciBpdGVyYXRvck1ldGhvZHMgPSBbXCJrZXlzXCIsIFwidmFsdWVzXCIsIFwiZW50cmllc1wiLCBTeW1ib2wuaXRlcmF0b3JdO1xuaXRlcmF0b3JNZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICBtdXRhYmxlSW5zdHJ1bWVudGF0aW9uc1ttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCBmYWxzZSwgZmFsc2UpO1xuICByZWFkb25seUluc3RydW1lbnRhdGlvbnNbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgdHJ1ZSwgZmFsc2UpO1xuICBzaGFsbG93SW5zdHJ1bWVudGF0aW9uc1ttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCBmYWxzZSwgdHJ1ZSk7XG4gIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnNbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgdHJ1ZSwgdHJ1ZSk7XG59KTtcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcihpc1JlYWRvbmx5LCBzaGFsbG93KSB7XG4gIGNvbnN0IGluc3RydW1lbnRhdGlvbnMgPSBzaGFsbG93ID8gaXNSZWFkb25seSA/IHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMgOiBzaGFsbG93SW5zdHJ1bWVudGF0aW9ucyA6IGlzUmVhZG9ubHkgPyByZWFkb25seUluc3RydW1lbnRhdGlvbnMgOiBtdXRhYmxlSW5zdHJ1bWVudGF0aW9ucztcbiAgcmV0dXJuICh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpID0+IHtcbiAgICBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWN0aXZlXCIpIHtcbiAgICAgIHJldHVybiAhaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFkb25seVwiKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfcmF3XCIpIHtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIHJldHVybiBSZWZsZWN0LmdldChoYXNPd24oaW5zdHJ1bWVudGF0aW9ucywga2V5KSAmJiBrZXkgaW4gdGFyZ2V0ID8gaW5zdHJ1bWVudGF0aW9ucyA6IHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH07XG59XG52YXIgbXV0YWJsZUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcbiAgZ2V0OiBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIoZmFsc2UsIGZhbHNlKVxufTtcbnZhciBzaGFsbG93Q29sbGVjdGlvbkhhbmRsZXJzID0ge1xuICBnZXQ6IGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcihmYWxzZSwgdHJ1ZSlcbn07XG52YXIgcmVhZG9ubHlDb2xsZWN0aW9uSGFuZGxlcnMgPSB7XG4gIGdldDogY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKHRydWUsIGZhbHNlKVxufTtcbnZhciBzaGFsbG93UmVhZG9ubHlDb2xsZWN0aW9uSGFuZGxlcnMgPSB7XG4gIGdldDogY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKHRydWUsIHRydWUpXG59O1xuZnVuY3Rpb24gY2hlY2tJZGVudGl0eUtleXModGFyZ2V0LCBoYXMyLCBrZXkpIHtcbiAgY29uc3QgcmF3S2V5ID0gdG9SYXcoa2V5KTtcbiAgaWYgKHJhd0tleSAhPT0ga2V5ICYmIGhhczIuY2FsbCh0YXJnZXQsIHJhd0tleSkpIHtcbiAgICBjb25zdCB0eXBlID0gdG9SYXdUeXBlKHRhcmdldCk7XG4gICAgY29uc29sZS53YXJuKGBSZWFjdGl2ZSAke3R5cGV9IGNvbnRhaW5zIGJvdGggdGhlIHJhdyBhbmQgcmVhY3RpdmUgdmVyc2lvbnMgb2YgdGhlIHNhbWUgb2JqZWN0JHt0eXBlID09PSBgTWFwYCA/IGAgYXMga2V5c2AgOiBgYH0sIHdoaWNoIGNhbiBsZWFkIHRvIGluY29uc2lzdGVuY2llcy4gQXZvaWQgZGlmZmVyZW50aWF0aW5nIGJldHdlZW4gdGhlIHJhdyBhbmQgcmVhY3RpdmUgdmVyc2lvbnMgb2YgYW4gb2JqZWN0IGFuZCBvbmx5IHVzZSB0aGUgcmVhY3RpdmUgdmVyc2lvbiBpZiBwb3NzaWJsZS5gKTtcbiAgfVxufVxudmFyIHJlYWN0aXZlTWFwID0gbmV3IFdlYWtNYXAoKTtcbnZhciBzaGFsbG93UmVhY3RpdmVNYXAgPSBuZXcgV2Vha01hcCgpO1xudmFyIHJlYWRvbmx5TWFwID0gbmV3IFdlYWtNYXAoKTtcbnZhciBzaGFsbG93UmVhZG9ubHlNYXAgPSBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gdGFyZ2V0VHlwZU1hcChyYXdUeXBlKSB7XG4gIHN3aXRjaCAocmF3VHlwZSkge1xuICAgIGNhc2UgXCJPYmplY3RcIjpcbiAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgIHJldHVybiAxO1xuICAgIGNhc2UgXCJNYXBcIjpcbiAgICBjYXNlIFwiU2V0XCI6XG4gICAgY2FzZSBcIldlYWtNYXBcIjpcbiAgICBjYXNlIFwiV2Vha1NldFwiOlxuICAgICAgcmV0dXJuIDI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAwO1xuICB9XG59XG5mdW5jdGlvbiBnZXRUYXJnZXRUeXBlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZVtcIl9fdl9za2lwXCJdIHx8ICFPYmplY3QuaXNFeHRlbnNpYmxlKHZhbHVlKSA/IDAgOiB0YXJnZXRUeXBlTWFwKHRvUmF3VHlwZSh2YWx1ZSkpO1xufVxuZnVuY3Rpb24gcmVhY3RpdmUyKHRhcmdldCkge1xuICBpZiAodGFyZ2V0ICYmIHRhcmdldFtcIl9fdl9pc1JlYWRvbmx5XCJdKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCBmYWxzZSwgbXV0YWJsZUhhbmRsZXJzLCBtdXRhYmxlQ29sbGVjdGlvbkhhbmRsZXJzLCByZWFjdGl2ZU1hcCk7XG59XG5mdW5jdGlvbiByZWFkb25seSh0YXJnZXQpIHtcbiAgcmV0dXJuIGNyZWF0ZVJlYWN0aXZlT2JqZWN0KHRhcmdldCwgdHJ1ZSwgcmVhZG9ubHlIYW5kbGVycywgcmVhZG9ubHlDb2xsZWN0aW9uSGFuZGxlcnMsIHJlYWRvbmx5TWFwKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJlYWN0aXZlT2JqZWN0KHRhcmdldCwgaXNSZWFkb25seSwgYmFzZUhhbmRsZXJzLCBjb2xsZWN0aW9uSGFuZGxlcnMsIHByb3h5TWFwKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYHZhbHVlIGNhbm5vdCBiZSBtYWRlIHJlYWN0aXZlOiAke1N0cmluZyh0YXJnZXQpfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIGlmICh0YXJnZXRbXCJfX3ZfcmF3XCJdICYmICEoaXNSZWFkb25seSAmJiB0YXJnZXRbXCJfX3ZfaXNSZWFjdGl2ZVwiXSkpIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIGNvbnN0IGV4aXN0aW5nUHJveHkgPSBwcm94eU1hcC5nZXQodGFyZ2V0KTtcbiAgaWYgKGV4aXN0aW5nUHJveHkpIHtcbiAgICByZXR1cm4gZXhpc3RpbmdQcm94eTtcbiAgfVxuICBjb25zdCB0YXJnZXRUeXBlID0gZ2V0VGFyZ2V0VHlwZSh0YXJnZXQpO1xuICBpZiAodGFyZ2V0VHlwZSA9PT0gMCkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkodGFyZ2V0LCB0YXJnZXRUeXBlID09PSAyID8gY29sbGVjdGlvbkhhbmRsZXJzIDogYmFzZUhhbmRsZXJzKTtcbiAgcHJveHlNYXAuc2V0KHRhcmdldCwgcHJveHkpO1xuICByZXR1cm4gcHJveHk7XG59XG5mdW5jdGlvbiB0b1JhdyhvYnNlcnZlZCkge1xuICByZXR1cm4gb2JzZXJ2ZWQgJiYgdG9SYXcob2JzZXJ2ZWRbXCJfX3ZfcmF3XCJdKSB8fCBvYnNlcnZlZDtcbn1cbmZ1bmN0aW9uIGlzUmVmKHIpIHtcbiAgcmV0dXJuIEJvb2xlYW4ociAmJiByLl9fdl9pc1JlZiA9PT0gdHJ1ZSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJG5leHRUaWNrLmpzXG5tYWdpYyhcIm5leHRUaWNrXCIsICgpID0+IG5leHRUaWNrKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kZGlzcGF0Y2guanNcbm1hZ2ljKFwiZGlzcGF0Y2hcIiwgKGVsKSA9PiBkaXNwYXRjaC5iaW5kKGRpc3BhdGNoLCBlbCkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyR3YXRjaC5qc1xubWFnaWMoXCJ3YXRjaFwiLCAoZWwsIHtldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMiwgZWZmZWN0OiBlZmZlY3QzfSkgPT4gKGtleSwgY2FsbGJhY2spID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIyKGtleSk7XG4gIGxldCBmaXJzdFRpbWUgPSB0cnVlO1xuICBsZXQgb2xkVmFsdWU7XG4gIGxldCBlZmZlY3RSZWZlcmVuY2UgPSBlZmZlY3QzKCgpID0+IGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgaWYgKCFmaXJzdFRpbWUpIHtcbiAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICAgICAgY2FsbGJhY2sodmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgb2xkVmFsdWUgPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgfSkpO1xuICBlbC5feF9lZmZlY3RzLmRlbGV0ZShlZmZlY3RSZWZlcmVuY2UpO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJHN0b3JlLmpzXG5tYWdpYyhcInN0b3JlXCIsIGdldFN0b3Jlcyk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGRhdGEuanNcbm1hZ2ljKFwiZGF0YVwiLCAoZWwpID0+IHNjb3BlKGVsKSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJHJvb3QuanNcbm1hZ2ljKFwicm9vdFwiLCAoZWwpID0+IGNsb3Nlc3RSb290KGVsKSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJHJlZnMuanNcbm1hZ2ljKFwicmVmc1wiLCAoZWwpID0+IHtcbiAgaWYgKGVsLl94X3JlZnNfcHJveHkpXG4gICAgcmV0dXJuIGVsLl94X3JlZnNfcHJveHk7XG4gIGVsLl94X3JlZnNfcHJveHkgPSBtZXJnZVByb3hpZXMoZ2V0QXJyYXlPZlJlZk9iamVjdChlbCkpO1xuICByZXR1cm4gZWwuX3hfcmVmc19wcm94eTtcbn0pO1xuZnVuY3Rpb24gZ2V0QXJyYXlPZlJlZk9iamVjdChlbCkge1xuICBsZXQgcmVmT2JqZWN0cyA9IFtdO1xuICBsZXQgY3VycmVudEVsID0gZWw7XG4gIHdoaWxlIChjdXJyZW50RWwpIHtcbiAgICBpZiAoY3VycmVudEVsLl94X3JlZnMpXG4gICAgICByZWZPYmplY3RzLnB1c2goY3VycmVudEVsLl94X3JlZnMpO1xuICAgIGN1cnJlbnRFbCA9IGN1cnJlbnRFbC5wYXJlbnROb2RlO1xuICB9XG4gIHJldHVybiByZWZPYmplY3RzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvaWRzLmpzXG52YXIgZ2xvYmFsSWRNZW1vID0ge307XG5mdW5jdGlvbiBmaW5kQW5kSW5jcmVtZW50SWQobmFtZSkge1xuICBpZiAoIWdsb2JhbElkTWVtb1tuYW1lXSlcbiAgICBnbG9iYWxJZE1lbW9bbmFtZV0gPSAwO1xuICByZXR1cm4gKytnbG9iYWxJZE1lbW9bbmFtZV07XG59XG5mdW5jdGlvbiBjbG9zZXN0SWRSb290KGVsLCBuYW1lKSB7XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbCwgKGVsZW1lbnQpID0+IHtcbiAgICBpZiAoZWxlbWVudC5feF9pZHMgJiYgZWxlbWVudC5feF9pZHNbbmFtZV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBzZXRJZFJvb3QoZWwsIG5hbWUpIHtcbiAgaWYgKCFlbC5feF9pZHMpXG4gICAgZWwuX3hfaWRzID0ge307XG4gIGlmICghZWwuX3hfaWRzW25hbWVdKVxuICAgIGVsLl94X2lkc1tuYW1lXSA9IGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kaWQuanNcbm1hZ2ljKFwiaWRcIiwgKGVsKSA9PiAobmFtZSwga2V5ID0gbnVsbCkgPT4ge1xuICBsZXQgcm9vdCA9IGNsb3Nlc3RJZFJvb3QoZWwsIG5hbWUpO1xuICBsZXQgaWQgPSByb290ID8gcm9vdC5feF9pZHNbbmFtZV0gOiBmaW5kQW5kSW5jcmVtZW50SWQobmFtZSk7XG4gIHJldHVybiBrZXkgPyBgJHtuYW1lfS0ke2lkfS0ke2tleX1gIDogYCR7bmFtZX0tJHtpZH1gO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGVsLmpzXG5tYWdpYyhcImVsXCIsIChlbCkgPT4gZWwpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzL2luZGV4LmpzXG53YXJuTWlzc2luZ1BsdWdpbk1hZ2ljKFwiRm9jdXNcIiwgXCJmb2N1c1wiLCBcImZvY3VzXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5NYWdpYyhcIlBlcnNpc3RcIiwgXCJwZXJzaXN0XCIsIFwicGVyc2lzdFwiKTtcbmZ1bmN0aW9uIHdhcm5NaXNzaW5nUGx1Z2luTWFnaWMobmFtZSwgbWFnaWNOYW1lLCBzbHVnKSB7XG4gIG1hZ2ljKG1hZ2ljTmFtZSwgKGVsKSA9PiB3YXJuKGBZb3UgY2FuJ3QgdXNlIFskJHtkaXJlY3RpdmVOYW1lfV0gd2l0aG91dCBmaXJzdCBpbnN0YWxsaW5nIHRoZSBcIiR7bmFtZX1cIiBwbHVnaW4gaGVyZTogaHR0cHM6Ly9hbHBpbmVqcy5kZXYvcGx1Z2lucy8ke3NsdWd9YCwgZWwpKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1tb2RlbGFibGUuanNcbmRpcmVjdGl2ZShcIm1vZGVsYWJsZVwiLCAoZWwsIHtleHByZXNzaW9ufSwge2VmZmVjdDogZWZmZWN0MywgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlcjJ9KSA9PiB7XG4gIGxldCBmdW5jID0gZXZhbHVhdGVMYXRlcjIoZXhwcmVzc2lvbik7XG4gIGxldCBpbm5lckdldCA9ICgpID0+IHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGZ1bmMoKGkpID0+IHJlc3VsdCA9IGkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIGxldCBldmFsdWF0ZUlubmVyU2V0ID0gZXZhbHVhdGVMYXRlcjIoYCR7ZXhwcmVzc2lvbn0gPSBfX3BsYWNlaG9sZGVyYCk7XG4gIGxldCBpbm5lclNldCA9ICh2YWwpID0+IGV2YWx1YXRlSW5uZXJTZXQoKCkgPT4ge1xuICB9LCB7c2NvcGU6IHtfX3BsYWNlaG9sZGVyOiB2YWx9fSk7XG4gIGxldCBpbml0aWFsVmFsdWUgPSBpbm5lckdldCgpO1xuICBpbm5lclNldChpbml0aWFsVmFsdWUpO1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgaWYgKCFlbC5feF9tb2RlbClcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0oKTtcbiAgICBsZXQgb3V0ZXJHZXQgPSBlbC5feF9tb2RlbC5nZXQ7XG4gICAgbGV0IG91dGVyU2V0ID0gZWwuX3hfbW9kZWwuc2V0O1xuICAgIGVmZmVjdDMoKCkgPT4gaW5uZXJTZXQob3V0ZXJHZXQoKSkpO1xuICAgIGVmZmVjdDMoKCkgPT4gb3V0ZXJTZXQoaW5uZXJHZXQoKSkpO1xuICB9KTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRlbGVwb3J0LmpzXG5kaXJlY3RpdmUoXCJ0ZWxlcG9ydFwiLCAoZWwsIHtleHByZXNzaW9ufSwge2NsZWFudXA6IGNsZWFudXAyfSkgPT4ge1xuICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcInRlbXBsYXRlXCIpXG4gICAgd2FybihcIngtdGVsZXBvcnQgY2FuIG9ubHkgYmUgdXNlZCBvbiBhIDx0ZW1wbGF0ZT4gdGFnXCIsIGVsKTtcbiAgbGV0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZXhwcmVzc2lvbik7XG4gIGlmICghdGFyZ2V0KVxuICAgIHdhcm4oYENhbm5vdCBmaW5kIHgtdGVsZXBvcnQgZWxlbWVudCBmb3Igc2VsZWN0b3I6IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gIGxldCBjbG9uZTIgPSBlbC5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgZWwuX3hfdGVsZXBvcnQgPSBjbG9uZTI7XG4gIGNsb25lMi5feF90ZWxlcG9ydEJhY2sgPSBlbDtcbiAgaWYgKGVsLl94X2ZvcndhcmRFdmVudHMpIHtcbiAgICBlbC5feF9mb3J3YXJkRXZlbnRzLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgY2xvbmUyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBlLmNvbnN0cnVjdG9yKGUudHlwZSwgZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgYWRkU2NvcGVUb05vZGUoY2xvbmUyLCB7fSwgZWwpO1xuICBtdXRhdGVEb20oKCkgPT4ge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChjbG9uZTIpO1xuICAgIGluaXRUcmVlKGNsb25lMik7XG4gICAgY2xvbmUyLl94X2lnbm9yZSA9IHRydWU7XG4gIH0pO1xuICBjbGVhbnVwMigoKSA9PiBjbG9uZTIucmVtb3ZlKCkpO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaWdub3JlLmpzXG52YXIgaGFuZGxlciA9ICgpID0+IHtcbn07XG5oYW5kbGVyLmlubGluZSA9IChlbCwge21vZGlmaWVyc30sIHtjbGVhbnVwOiBjbGVhbnVwMn0pID0+IHtcbiAgbW9kaWZpZXJzLmluY2x1ZGVzKFwic2VsZlwiKSA/IGVsLl94X2lnbm9yZVNlbGYgPSB0cnVlIDogZWwuX3hfaWdub3JlID0gdHJ1ZTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIG1vZGlmaWVycy5pbmNsdWRlcyhcInNlbGZcIikgPyBkZWxldGUgZWwuX3hfaWdub3JlU2VsZiA6IGRlbGV0ZSBlbC5feF9pZ25vcmU7XG4gIH0pO1xufTtcbmRpcmVjdGl2ZShcImlnbm9yZVwiLCBoYW5kbGVyKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1lZmZlY3QuanNcbmRpcmVjdGl2ZShcImVmZmVjdFwiLCAoZWwsIHtleHByZXNzaW9ufSwge2VmZmVjdDogZWZmZWN0M30pID0+IGVmZmVjdDMoZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbikpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL29uLmpzXG5mdW5jdGlvbiBvbihlbCwgZXZlbnQsIG1vZGlmaWVycywgY2FsbGJhY2spIHtcbiAgbGV0IGxpc3RlbmVyVGFyZ2V0ID0gZWw7XG4gIGxldCBoYW5kbGVyMyA9IChlKSA9PiBjYWxsYmFjayhlKTtcbiAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgbGV0IHdyYXBIYW5kbGVyID0gKGNhbGxiYWNrMiwgd3JhcHBlcikgPT4gKGUpID0+IHdyYXBwZXIoY2FsbGJhY2syLCBlKTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImRvdFwiKSlcbiAgICBldmVudCA9IGRvdFN5bnRheChldmVudCk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYW1lbFwiKSlcbiAgICBldmVudCA9IGNhbWVsQ2FzZTIoZXZlbnQpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSlcbiAgICBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSlcbiAgICBvcHRpb25zLmNhcHR1cmUgPSB0cnVlO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwid2luZG93XCIpKVxuICAgIGxpc3RlbmVyVGFyZ2V0ID0gd2luZG93O1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZG9jdW1lbnRcIikpXG4gICAgbGlzdGVuZXJUYXJnZXQgPSBkb2N1bWVudDtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInByZXZlbnRcIikpXG4gICAgaGFuZGxlcjMgPSB3cmFwSGFuZGxlcihoYW5kbGVyMywgKG5leHQsIGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJzdG9wXCIpKVxuICAgIGhhbmRsZXIzID0gd3JhcEhhbmRsZXIoaGFuZGxlcjMsIChuZXh0LCBlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInNlbGZcIikpXG4gICAgaGFuZGxlcjMgPSB3cmFwSGFuZGxlcihoYW5kbGVyMywgKG5leHQsIGUpID0+IHtcbiAgICAgIGUudGFyZ2V0ID09PSBlbCAmJiBuZXh0KGUpO1xuICAgIH0pO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYXdheVwiKSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRzaWRlXCIpKSB7XG4gICAgbGlzdGVuZXJUYXJnZXQgPSBkb2N1bWVudDtcbiAgICBoYW5kbGVyMyA9IHdyYXBIYW5kbGVyKGhhbmRsZXIzLCAobmV4dCwgZSkgPT4ge1xuICAgICAgaWYgKGVsLmNvbnRhaW5zKGUudGFyZ2V0KSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGUudGFyZ2V0LmlzQ29ubmVjdGVkID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGVsLm9mZnNldFdpZHRoIDwgMSAmJiBlbC5vZmZzZXRIZWlnaHQgPCAxKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZWwuX3hfaXNTaG93biA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybjtcbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm9uY2VcIikpIHtcbiAgICBoYW5kbGVyMyA9IHdyYXBIYW5kbGVyKGhhbmRsZXIzLCAobmV4dCwgZSkgPT4ge1xuICAgICAgbmV4dChlKTtcbiAgICAgIGxpc3RlbmVyVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIzLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuICBoYW5kbGVyMyA9IHdyYXBIYW5kbGVyKGhhbmRsZXIzLCAobmV4dCwgZSkgPT4ge1xuICAgIGlmIChpc0tleUV2ZW50KGV2ZW50KSkge1xuICAgICAgaWYgKGlzTGlzdGVuaW5nRm9yQVNwZWNpZmljS2V5VGhhdEhhc250QmVlblByZXNzZWQoZSwgbW9kaWZpZXJzKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIG5leHQoZSk7XG4gIH0pO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZGVib3VuY2VcIikpIHtcbiAgICBsZXQgbmV4dE1vZGlmaWVyID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKFwiZGVib3VuY2VcIikgKyAxXSB8fCBcImludmFsaWQtd2FpdFwiO1xuICAgIGxldCB3YWl0ID0gaXNOdW1lcmljKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA/IE51bWJlcihuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgOiAyNTA7XG4gICAgaGFuZGxlcjMgPSBkZWJvdW5jZShoYW5kbGVyMywgd2FpdCk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInRocm90dGxlXCIpKSB7XG4gICAgbGV0IG5leHRNb2RpZmllciA9IG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihcInRocm90dGxlXCIpICsgMV0gfHwgXCJpbnZhbGlkLXdhaXRcIjtcbiAgICBsZXQgd2FpdCA9IGlzTnVtZXJpYyhuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgPyBOdW1iZXIobmV4dE1vZGlmaWVyLnNwbGl0KFwibXNcIilbMF0pIDogMjUwO1xuICAgIGhhbmRsZXIzID0gdGhyb3R0bGUoaGFuZGxlcjMsIHdhaXQpO1xuICB9XG4gIGxpc3RlbmVyVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIzLCBvcHRpb25zKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBsaXN0ZW5lclRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyMywgb3B0aW9ucyk7XG4gIH07XG59XG5mdW5jdGlvbiBkb3RTeW50YXgoc3ViamVjdCkge1xuICByZXR1cm4gc3ViamVjdC5yZXBsYWNlKC8tL2csIFwiLlwiKTtcbn1cbmZ1bmN0aW9uIGNhbWVsQ2FzZTIoc3ViamVjdCkge1xuICByZXR1cm4gc3ViamVjdC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLy0oXFx3KS9nLCAobWF0Y2gsIGNoYXIpID0+IGNoYXIudG9VcHBlckNhc2UoKSk7XG59XG5mdW5jdGlvbiBpc051bWVyaWMoc3ViamVjdCkge1xuICByZXR1cm4gIUFycmF5LmlzQXJyYXkoc3ViamVjdCkgJiYgIWlzTmFOKHN1YmplY3QpO1xufVxuZnVuY3Rpb24ga2ViYWJDYXNlMihzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIFwiJDEtJDJcIikucmVwbGFjZSgvW19cXHNdLywgXCItXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5mdW5jdGlvbiBpc0tleUV2ZW50KGV2ZW50KSB7XG4gIHJldHVybiBbXCJrZXlkb3duXCIsIFwia2V5dXBcIl0uaW5jbHVkZXMoZXZlbnQpO1xufVxuZnVuY3Rpb24gaXNMaXN0ZW5pbmdGb3JBU3BlY2lmaWNLZXlUaGF0SGFzbnRCZWVuUHJlc3NlZChlLCBtb2RpZmllcnMpIHtcbiAgbGV0IGtleU1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKGkpID0+IHtcbiAgICByZXR1cm4gIVtcIndpbmRvd1wiLCBcImRvY3VtZW50XCIsIFwicHJldmVudFwiLCBcInN0b3BcIiwgXCJvbmNlXCJdLmluY2x1ZGVzKGkpO1xuICB9KTtcbiAgaWYgKGtleU1vZGlmaWVycy5pbmNsdWRlcyhcImRlYm91bmNlXCIpKSB7XG4gICAgbGV0IGRlYm91bmNlSW5kZXggPSBrZXlNb2RpZmllcnMuaW5kZXhPZihcImRlYm91bmNlXCIpO1xuICAgIGtleU1vZGlmaWVycy5zcGxpY2UoZGVib3VuY2VJbmRleCwgaXNOdW1lcmljKChrZXlNb2RpZmllcnNbZGVib3VuY2VJbmRleCArIDFdIHx8IFwiaW52YWxpZC13YWl0XCIpLnNwbGl0KFwibXNcIilbMF0pID8gMiA6IDEpO1xuICB9XG4gIGlmIChrZXlNb2RpZmllcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGtleU1vZGlmaWVycy5sZW5ndGggPT09IDEgJiYga2V5VG9Nb2RpZmllcnMoZS5rZXkpLmluY2x1ZGVzKGtleU1vZGlmaWVyc1swXSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzeXN0ZW1LZXlNb2RpZmllcnMgPSBbXCJjdHJsXCIsIFwic2hpZnRcIiwgXCJhbHRcIiwgXCJtZXRhXCIsIFwiY21kXCIsIFwic3VwZXJcIl07XG4gIGNvbnN0IHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzID0gc3lzdGVtS2V5TW9kaWZpZXJzLmZpbHRlcigobW9kaWZpZXIpID0+IGtleU1vZGlmaWVycy5pbmNsdWRlcyhtb2RpZmllcikpO1xuICBrZXlNb2RpZmllcnMgPSBrZXlNb2RpZmllcnMuZmlsdGVyKChpKSA9PiAhc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMuaW5jbHVkZXMoaSkpO1xuICBpZiAoc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGFjdGl2ZWx5UHJlc3NlZEtleU1vZGlmaWVycyA9IHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmZpbHRlcigobW9kaWZpZXIpID0+IHtcbiAgICAgIGlmIChtb2RpZmllciA9PT0gXCJjbWRcIiB8fCBtb2RpZmllciA9PT0gXCJzdXBlclwiKVxuICAgICAgICBtb2RpZmllciA9IFwibWV0YVwiO1xuICAgICAgcmV0dXJuIGVbYCR7bW9kaWZpZXJ9S2V5YF07XG4gICAgfSk7XG4gICAgaWYgKGFjdGl2ZWx5UHJlc3NlZEtleU1vZGlmaWVycy5sZW5ndGggPT09IHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmxlbmd0aCkge1xuICAgICAgaWYgKGtleVRvTW9kaWZpZXJzKGUua2V5KS5pbmNsdWRlcyhrZXlNb2RpZmllcnNbMF0pKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24ga2V5VG9Nb2RpZmllcnMoa2V5KSB7XG4gIGlmICgha2V5KVxuICAgIHJldHVybiBbXTtcbiAga2V5ID0ga2ViYWJDYXNlMihrZXkpO1xuICBsZXQgbW9kaWZpZXJUb0tleU1hcCA9IHtcbiAgICBjdHJsOiBcImNvbnRyb2xcIixcbiAgICBzbGFzaDogXCIvXCIsXG4gICAgc3BhY2U6IFwiLVwiLFxuICAgIHNwYWNlYmFyOiBcIi1cIixcbiAgICBjbWQ6IFwibWV0YVwiLFxuICAgIGVzYzogXCJlc2NhcGVcIixcbiAgICB1cDogXCJhcnJvdy11cFwiLFxuICAgIGRvd246IFwiYXJyb3ctZG93blwiLFxuICAgIGxlZnQ6IFwiYXJyb3ctbGVmdFwiLFxuICAgIHJpZ2h0OiBcImFycm93LXJpZ2h0XCIsXG4gICAgcGVyaW9kOiBcIi5cIixcbiAgICBlcXVhbDogXCI9XCJcbiAgfTtcbiAgbW9kaWZpZXJUb0tleU1hcFtrZXldID0ga2V5O1xuICByZXR1cm4gT2JqZWN0LmtleXMobW9kaWZpZXJUb0tleU1hcCkubWFwKChtb2RpZmllcikgPT4ge1xuICAgIGlmIChtb2RpZmllclRvS2V5TWFwW21vZGlmaWVyXSA9PT0ga2V5KVxuICAgICAgcmV0dXJuIG1vZGlmaWVyO1xuICB9KS5maWx0ZXIoKG1vZGlmaWVyKSA9PiBtb2RpZmllcik7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtbW9kZWwuanNcbmRpcmVjdGl2ZShcIm1vZGVsXCIsIChlbCwge21vZGlmaWVycywgZXhwcmVzc2lvbn0sIHtlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGxldCBhc3NpZ25tZW50RXhwcmVzc2lvbiA9IGAke2V4cHJlc3Npb259ID0gcmlnaHRTaWRlT2ZFeHByZXNzaW9uKCRldmVudCwgJHtleHByZXNzaW9ufSlgO1xuICBsZXQgZXZhbHVhdGVBc3NpZ25tZW50ID0gZXZhbHVhdGVMYXRlcihlbCwgYXNzaWdubWVudEV4cHJlc3Npb24pO1xuICB2YXIgZXZlbnQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgfHwgW1wiY2hlY2tib3hcIiwgXCJyYWRpb1wiXS5pbmNsdWRlcyhlbC50eXBlKSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJsYXp5XCIpID8gXCJjaGFuZ2VcIiA6IFwiaW5wdXRcIjtcbiAgbGV0IGFzc2lnbWVudEZ1bmN0aW9uID0gZ2VuZXJhdGVBc3NpZ25tZW50RnVuY3Rpb24oZWwsIG1vZGlmaWVycywgZXhwcmVzc2lvbik7XG4gIGxldCByZW1vdmVMaXN0ZW5lciA9IG9uKGVsLCBldmVudCwgbW9kaWZpZXJzLCAoZSkgPT4ge1xuICAgIGV2YWx1YXRlQXNzaWdubWVudCgoKSA9PiB7XG4gICAgfSwge3Njb3BlOiB7XG4gICAgICAkZXZlbnQ6IGUsXG4gICAgICByaWdodFNpZGVPZkV4cHJlc3Npb246IGFzc2lnbWVudEZ1bmN0aW9uXG4gICAgfX0pO1xuICB9KTtcbiAgaWYgKCFlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVycylcbiAgICBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVycyA9IHt9O1xuICBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0gPSByZW1vdmVMaXN0ZW5lcjtcbiAgY2xlYW51cDIoKCkgPT4gZWwuX3hfcmVtb3ZlTW9kZWxMaXN0ZW5lcnNbXCJkZWZhdWx0XCJdKCkpO1xuICBsZXQgZXZhbHVhdGVTZXRNb2RlbCA9IGV2YWx1YXRlTGF0ZXIoZWwsIGAke2V4cHJlc3Npb259ID0gX19wbGFjZWhvbGRlcmApO1xuICBlbC5feF9tb2RlbCA9IHtcbiAgICBnZXQoKSB7XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgZXZhbHVhdGUyKCh2YWx1ZSkgPT4gcmVzdWx0ID0gdmFsdWUpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIHNldCh2YWx1ZSkge1xuICAgICAgZXZhbHVhdGVTZXRNb2RlbCgoKSA9PiB7XG4gICAgICB9LCB7c2NvcGU6IHtfX3BsYWNlaG9sZGVyOiB2YWx1ZX19KTtcbiAgICB9XG4gIH07XG4gIGVsLl94X2ZvcmNlTW9kZWxVcGRhdGUgPSAoKSA9PiB7XG4gICAgZXZhbHVhdGUyKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlID09PSB2b2lkIDAgJiYgZXhwcmVzc2lvbi5tYXRjaCgvXFwuLykpXG4gICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgIHdpbmRvdy5mcm9tTW9kZWwgPSB0cnVlO1xuICAgICAgbXV0YXRlRG9tKCgpID0+IGJpbmQoZWwsIFwidmFsdWVcIiwgdmFsdWUpKTtcbiAgICAgIGRlbGV0ZSB3aW5kb3cuZnJvbU1vZGVsO1xuICAgIH0pO1xuICB9O1xuICBlZmZlY3QzKCgpID0+IHtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwidW5pbnRydXNpdmVcIikgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5pc1NhbWVOb2RlKGVsKSlcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF9mb3JjZU1vZGVsVXBkYXRlKCk7XG4gIH0pO1xufSk7XG5mdW5jdGlvbiBnZW5lcmF0ZUFzc2lnbm1lbnRGdW5jdGlvbihlbCwgbW9kaWZpZXJzLCBleHByZXNzaW9uKSB7XG4gIGlmIChlbC50eXBlID09PSBcInJhZGlvXCIpIHtcbiAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUoXCJuYW1lXCIpKVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIGV4cHJlc3Npb24pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiAoZXZlbnQsIGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgIHJldHVybiBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgJiYgZXZlbnQuZGV0YWlsICE9PSB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50LmRldGFpbCB8fCBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgbGV0IG5ld1ZhbHVlID0gbW9kaWZpZXJzLmluY2x1ZGVzKFwibnVtYmVyXCIpID8gc2FmZVBhcnNlTnVtYmVyKGV2ZW50LnRhcmdldC52YWx1ZSkgOiBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgcmV0dXJuIGV2ZW50LnRhcmdldC5jaGVja2VkID8gY3VycmVudFZhbHVlLmNvbmNhdChbbmV3VmFsdWVdKSA6IGN1cnJlbnRWYWx1ZS5maWx0ZXIoKGVsMikgPT4gIWNoZWNrZWRBdHRyTG9vc2VDb21wYXJlMihlbDIsIG5ld1ZhbHVlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGV2ZW50LnRhcmdldC5jaGVja2VkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiAmJiBlbC5tdWx0aXBsZSkge1xuICAgICAgICByZXR1cm4gbW9kaWZpZXJzLmluY2x1ZGVzKFwibnVtYmVyXCIpID8gQXJyYXkuZnJvbShldmVudC50YXJnZXQuc2VsZWN0ZWRPcHRpb25zKS5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgICAgIGxldCByYXdWYWx1ZSA9IG9wdGlvbi52YWx1ZSB8fCBvcHRpb24udGV4dDtcbiAgICAgICAgICByZXR1cm4gc2FmZVBhcnNlTnVtYmVyKHJhd1ZhbHVlKTtcbiAgICAgICAgfSkgOiBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5zZWxlY3RlZE9wdGlvbnMpLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZSB8fCBvcHRpb24udGV4dDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcmF3VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIHJldHVybiBtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikgPyBzYWZlUGFyc2VOdW1iZXIocmF3VmFsdWUpIDogbW9kaWZpZXJzLmluY2x1ZGVzKFwidHJpbVwiKSA/IHJhd1ZhbHVlLnRyaW0oKSA6IHJhd1ZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuZnVuY3Rpb24gc2FmZVBhcnNlTnVtYmVyKHJhd1ZhbHVlKSB7XG4gIGxldCBudW1iZXIgPSByYXdWYWx1ZSA/IHBhcnNlRmxvYXQocmF3VmFsdWUpIDogbnVsbDtcbiAgcmV0dXJuIGlzTnVtZXJpYzIobnVtYmVyKSA/IG51bWJlciA6IHJhd1ZhbHVlO1xufVxuZnVuY3Rpb24gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUyKHZhbHVlQSwgdmFsdWVCKSB7XG4gIHJldHVybiB2YWx1ZUEgPT0gdmFsdWVCO1xufVxuZnVuY3Rpb24gaXNOdW1lcmljMihzdWJqZWN0KSB7XG4gIHJldHVybiAhQXJyYXkuaXNBcnJheShzdWJqZWN0KSAmJiAhaXNOYU4oc3ViamVjdCk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtY2xvYWsuanNcbmRpcmVjdGl2ZShcImNsb2FrXCIsIChlbCkgPT4gcXVldWVNaWNyb3Rhc2soKCkgPT4gbXV0YXRlRG9tKCgpID0+IGVsLnJlbW92ZUF0dHJpYnV0ZShwcmVmaXgoXCJjbG9ha1wiKSkpKSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaW5pdC5qc1xuYWRkSW5pdFNlbGVjdG9yKCgpID0+IGBbJHtwcmVmaXgoXCJpbml0XCIpfV1gKTtcbmRpcmVjdGl2ZShcImluaXRcIiwgc2tpcER1cmluZ0Nsb25lKChlbCwge2V4cHJlc3Npb259LCB7ZXZhbHVhdGU6IGV2YWx1YXRlMn0pID0+IHtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuICEhZXhwcmVzc2lvbi50cmltKCkgJiYgZXZhbHVhdGUyKGV4cHJlc3Npb24sIHt9LCBmYWxzZSk7XG4gIH1cbiAgcmV0dXJuIGV2YWx1YXRlMihleHByZXNzaW9uLCB7fSwgZmFsc2UpO1xufSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRleHQuanNcbmRpcmVjdGl2ZShcInRleHRcIiwgKGVsLCB7ZXhwcmVzc2lvbn0sIHtlZmZlY3Q6IGVmZmVjdDMsIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1odG1sLmpzXG5kaXJlY3RpdmUoXCJodG1sXCIsIChlbCwge2V4cHJlc3Npb259LCB7ZWZmZWN0OiBlZmZlY3QzLCBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMn0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIyKGV4cHJlc3Npb24pO1xuICBlZmZlY3QzKCgpID0+IHtcbiAgICBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgZWwuX3hfaWdub3JlU2VsZiA9IHRydWU7XG4gICAgICAgIGluaXRUcmVlKGVsKTtcbiAgICAgICAgZGVsZXRlIGVsLl94X2lnbm9yZVNlbGY7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1iaW5kLmpzXG5tYXBBdHRyaWJ1dGVzKHN0YXJ0aW5nV2l0aChcIjpcIiwgaW50byhwcmVmaXgoXCJiaW5kOlwiKSkpKTtcbmRpcmVjdGl2ZShcImJpbmRcIiwgKGVsLCB7dmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiwgb3JpZ2luYWx9LCB7ZWZmZWN0OiBlZmZlY3QzfSkgPT4ge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgbGV0IGJpbmRpbmdQcm92aWRlcnMgPSB7fTtcbiAgICBpbmplY3RCaW5kaW5nUHJvdmlkZXJzKGJpbmRpbmdQcm92aWRlcnMpO1xuICAgIGxldCBnZXRCaW5kaW5ncyA9IGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pO1xuICAgIGdldEJpbmRpbmdzKChiaW5kaW5ncykgPT4ge1xuICAgICAgYXBwbHlCaW5kaW5nc09iamVjdChlbCwgYmluZGluZ3MsIG9yaWdpbmFsKTtcbiAgICB9LCB7c2NvcGU6IGJpbmRpbmdQcm92aWRlcnN9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHZhbHVlID09PSBcImtleVwiKVxuICAgIHJldHVybiBzdG9yZUtleUZvclhGb3IoZWwsIGV4cHJlc3Npb24pO1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4gZXZhbHVhdGUyKChyZXN1bHQpID0+IHtcbiAgICBpZiAocmVzdWx0ID09PSB2b2lkIDAgJiYgdHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIgJiYgZXhwcmVzc2lvbi5tYXRjaCgvXFwuLykpIHtcbiAgICAgIHJlc3VsdCA9IFwiXCI7XG4gICAgfVxuICAgIG11dGF0ZURvbSgoKSA9PiBiaW5kKGVsLCB2YWx1ZSwgcmVzdWx0LCBtb2RpZmllcnMpKTtcbiAgfSkpO1xufSk7XG5mdW5jdGlvbiBzdG9yZUtleUZvclhGb3IoZWwsIGV4cHJlc3Npb24pIHtcbiAgZWwuX3hfa2V5RXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtZGF0YS5qc1xuYWRkUm9vdFNlbGVjdG9yKCgpID0+IGBbJHtwcmVmaXgoXCJkYXRhXCIpfV1gKTtcbmRpcmVjdGl2ZShcImRhdGFcIiwgc2tpcER1cmluZ0Nsb25lKChlbCwge2V4cHJlc3Npb259LCB7Y2xlYW51cDogY2xlYW51cDJ9KSA9PiB7XG4gIGV4cHJlc3Npb24gPSBleHByZXNzaW9uID09PSBcIlwiID8gXCJ7fVwiIDogZXhwcmVzc2lvbjtcbiAgbGV0IG1hZ2ljQ29udGV4dCA9IHt9O1xuICBpbmplY3RNYWdpY3MobWFnaWNDb250ZXh0LCBlbCk7XG4gIGxldCBkYXRhUHJvdmlkZXJDb250ZXh0ID0ge307XG4gIGluamVjdERhdGFQcm92aWRlcnMoZGF0YVByb3ZpZGVyQ29udGV4dCwgbWFnaWNDb250ZXh0KTtcbiAgbGV0IGRhdGEyID0gZXZhbHVhdGUoZWwsIGV4cHJlc3Npb24sIHtzY29wZTogZGF0YVByb3ZpZGVyQ29udGV4dH0pO1xuICBpZiAoZGF0YTIgPT09IHZvaWQgMClcbiAgICBkYXRhMiA9IHt9O1xuICBpbmplY3RNYWdpY3MoZGF0YTIsIGVsKTtcbiAgbGV0IHJlYWN0aXZlRGF0YSA9IHJlYWN0aXZlKGRhdGEyKTtcbiAgaW5pdEludGVyY2VwdG9ycyhyZWFjdGl2ZURhdGEpO1xuICBsZXQgdW5kbyA9IGFkZFNjb3BlVG9Ob2RlKGVsLCByZWFjdGl2ZURhdGEpO1xuICByZWFjdGl2ZURhdGFbXCJpbml0XCJdICYmIGV2YWx1YXRlKGVsLCByZWFjdGl2ZURhdGFbXCJpbml0XCJdKTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIHJlYWN0aXZlRGF0YVtcImRlc3Ryb3lcIl0gJiYgZXZhbHVhdGUoZWwsIHJlYWN0aXZlRGF0YVtcImRlc3Ryb3lcIl0pO1xuICAgIHVuZG8oKTtcbiAgfSk7XG59KSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtc2hvdy5qc1xuZGlyZWN0aXZlKFwic2hvd1wiLCAoZWwsIHttb2RpZmllcnMsIGV4cHJlc3Npb259LCB7ZWZmZWN0OiBlZmZlY3QzfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGlmICghZWwuX3hfZG9IaWRlKVxuICAgIGVsLl94X2RvSGlkZSA9ICgpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KFwiZGlzcGxheVwiLCBcIm5vbmVcIiwgbW9kaWZpZXJzLmluY2x1ZGVzKFwiaW1wb3J0YW50XCIpID8gXCJpbXBvcnRhbnRcIiA6IHZvaWQgMCk7XG4gICAgICB9KTtcbiAgICB9O1xuICBpZiAoIWVsLl94X2RvU2hvdylcbiAgICBlbC5feF9kb1Nob3cgPSAoKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBpZiAoZWwuc3R5bGUubGVuZ3RoID09PSAxICYmIGVsLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICBsZXQgaGlkZSA9ICgpID0+IHtcbiAgICBlbC5feF9kb0hpZGUoKTtcbiAgICBlbC5feF9pc1Nob3duID0gZmFsc2U7XG4gIH07XG4gIGxldCBzaG93ID0gKCkgPT4ge1xuICAgIGVsLl94X2RvU2hvdygpO1xuICAgIGVsLl94X2lzU2hvd24gPSB0cnVlO1xuICB9O1xuICBsZXQgY2xpY2tBd2F5Q29tcGF0aWJsZVNob3cgPSAoKSA9PiBzZXRUaW1lb3V0KHNob3cpO1xuICBsZXQgdG9nZ2xlID0gb25jZSgodmFsdWUpID0+IHZhbHVlID8gc2hvdygpIDogaGlkZSgpLCAodmFsdWUpID0+IHtcbiAgICBpZiAodHlwZW9mIGVsLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgZWwuX3hfdG9nZ2xlQW5kQ2FzY2FkZVdpdGhUcmFuc2l0aW9ucyhlbCwgdmFsdWUsIHNob3csIGhpZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA/IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCkgOiBoaWRlKCk7XG4gICAgfVxuICB9KTtcbiAgbGV0IG9sZFZhbHVlO1xuICBsZXQgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgZWZmZWN0MygoKSA9PiBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgaWYgKCFmaXJzdFRpbWUgJiYgdmFsdWUgPT09IG9sZFZhbHVlKVxuICAgICAgcmV0dXJuO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJpbW1lZGlhdGVcIikpXG4gICAgICB2YWx1ZSA/IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCkgOiBoaWRlKCk7XG4gICAgdG9nZ2xlKHZhbHVlKTtcbiAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICB9KSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1mb3IuanNcbmRpcmVjdGl2ZShcImZvclwiLCAoZWwsIHtleHByZXNzaW9ufSwge2VmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDJ9KSA9PiB7XG4gIGxldCBpdGVyYXRvck5hbWVzID0gcGFyc2VGb3JFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICBsZXQgZXZhbHVhdGVJdGVtcyA9IGV2YWx1YXRlTGF0ZXIoZWwsIGl0ZXJhdG9yTmFtZXMuaXRlbXMpO1xuICBsZXQgZXZhbHVhdGVLZXkgPSBldmFsdWF0ZUxhdGVyKGVsLCBlbC5feF9rZXlFeHByZXNzaW9uIHx8IFwiaW5kZXhcIik7XG4gIGVsLl94X3ByZXZLZXlzID0gW107XG4gIGVsLl94X2xvb2t1cCA9IHt9O1xuICBlZmZlY3QzKCgpID0+IGxvb3AoZWwsIGl0ZXJhdG9yTmFtZXMsIGV2YWx1YXRlSXRlbXMsIGV2YWx1YXRlS2V5KSk7XG4gIGNsZWFudXAyKCgpID0+IHtcbiAgICBPYmplY3QudmFsdWVzKGVsLl94X2xvb2t1cCkuZm9yRWFjaCgoZWwyKSA9PiBlbDIucmVtb3ZlKCkpO1xuICAgIGRlbGV0ZSBlbC5feF9wcmV2S2V5cztcbiAgICBkZWxldGUgZWwuX3hfbG9va3VwO1xuICB9KTtcbn0pO1xuZnVuY3Rpb24gbG9vcChlbCwgaXRlcmF0b3JOYW1lcywgZXZhbHVhdGVJdGVtcywgZXZhbHVhdGVLZXkpIHtcbiAgbGV0IGlzT2JqZWN0MiA9IChpKSA9PiB0eXBlb2YgaSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShpKTtcbiAgbGV0IHRlbXBsYXRlRWwgPSBlbDtcbiAgZXZhbHVhdGVJdGVtcygoaXRlbXMpID0+IHtcbiAgICBpZiAoaXNOdW1lcmljMyhpdGVtcykgJiYgaXRlbXMgPj0gMCkge1xuICAgICAgaXRlbXMgPSBBcnJheS5mcm9tKEFycmF5KGl0ZW1zKS5rZXlzKCksIChpKSA9PiBpICsgMSk7XG4gICAgfVxuICAgIGlmIChpdGVtcyA9PT0gdm9pZCAwKVxuICAgICAgaXRlbXMgPSBbXTtcbiAgICBsZXQgbG9va3VwID0gZWwuX3hfbG9va3VwO1xuICAgIGxldCBwcmV2S2V5cyA9IGVsLl94X3ByZXZLZXlzO1xuICAgIGxldCBzY29wZXMgPSBbXTtcbiAgICBsZXQga2V5cyA9IFtdO1xuICAgIGlmIChpc09iamVjdDIoaXRlbXMpKSB7XG4gICAgICBpdGVtcyA9IE9iamVjdC5lbnRyaWVzKGl0ZW1zKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBsZXQgc2NvcGUyID0gZ2V0SXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMoaXRlcmF0b3JOYW1lcywgdmFsdWUsIGtleSwgaXRlbXMpO1xuICAgICAgICBldmFsdWF0ZUtleSgodmFsdWUyKSA9PiBrZXlzLnB1c2godmFsdWUyKSwge3Njb3BlOiB7aW5kZXg6IGtleSwgLi4uc2NvcGUyfX0pO1xuICAgICAgICBzY29wZXMucHVzaChzY29wZTIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHNjb3BlMiA9IGdldEl0ZXJhdGlvblNjb3BlVmFyaWFibGVzKGl0ZXJhdG9yTmFtZXMsIGl0ZW1zW2ldLCBpLCBpdGVtcyk7XG4gICAgICAgIGV2YWx1YXRlS2V5KCh2YWx1ZSkgPT4ga2V5cy5wdXNoKHZhbHVlKSwge3Njb3BlOiB7aW5kZXg6IGksIC4uLnNjb3BlMn19KTtcbiAgICAgICAgc2NvcGVzLnB1c2goc2NvcGUyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGFkZHMgPSBbXTtcbiAgICBsZXQgbW92ZXMgPSBbXTtcbiAgICBsZXQgcmVtb3ZlcyA9IFtdO1xuICAgIGxldCBzYW1lcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldktleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBwcmV2S2V5c1tpXTtcbiAgICAgIGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpXG4gICAgICAgIHJlbW92ZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBwcmV2S2V5cyA9IHByZXZLZXlzLmZpbHRlcigoa2V5KSA9PiAhcmVtb3Zlcy5pbmNsdWRlcyhrZXkpKTtcbiAgICBsZXQgbGFzdEtleSA9IFwidGVtcGxhdGVcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgICAgbGV0IHByZXZJbmRleCA9IHByZXZLZXlzLmluZGV4T2Yoa2V5KTtcbiAgICAgIGlmIChwcmV2SW5kZXggPT09IC0xKSB7XG4gICAgICAgIHByZXZLZXlzLnNwbGljZShpLCAwLCBrZXkpO1xuICAgICAgICBhZGRzLnB1c2goW2xhc3RLZXksIGldKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldkluZGV4ICE9PSBpKSB7XG4gICAgICAgIGxldCBrZXlJblNwb3QgPSBwcmV2S2V5cy5zcGxpY2UoaSwgMSlbMF07XG4gICAgICAgIGxldCBrZXlGb3JTcG90ID0gcHJldktleXMuc3BsaWNlKHByZXZJbmRleCAtIDEsIDEpWzBdO1xuICAgICAgICBwcmV2S2V5cy5zcGxpY2UoaSwgMCwga2V5Rm9yU3BvdCk7XG4gICAgICAgIHByZXZLZXlzLnNwbGljZShwcmV2SW5kZXgsIDAsIGtleUluU3BvdCk7XG4gICAgICAgIG1vdmVzLnB1c2goW2tleUluU3BvdCwga2V5Rm9yU3BvdF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2FtZXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgICAgbGFzdEtleSA9IGtleTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0gcmVtb3Zlc1tpXTtcbiAgICAgIGlmICghIWxvb2t1cFtrZXldLl94X2VmZmVjdHMpIHtcbiAgICAgICAgbG9va3VwW2tleV0uX3hfZWZmZWN0cy5mb3JFYWNoKGRlcXVldWVKb2IpO1xuICAgICAgfVxuICAgICAgbG9va3VwW2tleV0ucmVtb3ZlKCk7XG4gICAgICBsb29rdXBba2V5XSA9IG51bGw7XG4gICAgICBkZWxldGUgbG9va3VwW2tleV07XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBba2V5SW5TcG90LCBrZXlGb3JTcG90XSA9IG1vdmVzW2ldO1xuICAgICAgbGV0IGVsSW5TcG90ID0gbG9va3VwW2tleUluU3BvdF07XG4gICAgICBsZXQgZWxGb3JTcG90ID0gbG9va3VwW2tleUZvclNwb3RdO1xuICAgICAgbGV0IG1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBlbEZvclNwb3QuYWZ0ZXIobWFya2VyKTtcbiAgICAgICAgZWxJblNwb3QuYWZ0ZXIoZWxGb3JTcG90KTtcbiAgICAgICAgZWxGb3JTcG90Ll94X2N1cnJlbnRJZkVsICYmIGVsRm9yU3BvdC5hZnRlcihlbEZvclNwb3QuX3hfY3VycmVudElmRWwpO1xuICAgICAgICBtYXJrZXIuYmVmb3JlKGVsSW5TcG90KTtcbiAgICAgICAgZWxJblNwb3QuX3hfY3VycmVudElmRWwgJiYgZWxJblNwb3QuYWZ0ZXIoZWxJblNwb3QuX3hfY3VycmVudElmRWwpO1xuICAgICAgICBtYXJrZXIucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIHJlZnJlc2hTY29wZShlbEZvclNwb3QsIHNjb3Blc1trZXlzLmluZGV4T2Yoa2V5Rm9yU3BvdCldKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgW2xhc3RLZXkyLCBpbmRleF0gPSBhZGRzW2ldO1xuICAgICAgbGV0IGxhc3RFbCA9IGxhc3RLZXkyID09PSBcInRlbXBsYXRlXCIgPyB0ZW1wbGF0ZUVsIDogbG9va3VwW2xhc3RLZXkyXTtcbiAgICAgIGlmIChsYXN0RWwuX3hfY3VycmVudElmRWwpXG4gICAgICAgIGxhc3RFbCA9IGxhc3RFbC5feF9jdXJyZW50SWZFbDtcbiAgICAgIGxldCBzY29wZTIgPSBzY29wZXNbaW5kZXhdO1xuICAgICAgbGV0IGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgbGV0IGNsb25lMiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGVFbC5jb250ZW50LCB0cnVlKS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgIGFkZFNjb3BlVG9Ob2RlKGNsb25lMiwgcmVhY3RpdmUoc2NvcGUyKSwgdGVtcGxhdGVFbCk7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBsYXN0RWwuYWZ0ZXIoY2xvbmUyKTtcbiAgICAgICAgaW5pdFRyZWUoY2xvbmUyKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgd2FybihcIngtZm9yIGtleSBjYW5ub3QgYmUgYW4gb2JqZWN0LCBpdCBtdXN0IGJlIGEgc3RyaW5nIG9yIGFuIGludGVnZXJcIiwgdGVtcGxhdGVFbCk7XG4gICAgICB9XG4gICAgICBsb29rdXBba2V5XSA9IGNsb25lMjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVmcmVzaFNjb3BlKGxvb2t1cFtzYW1lc1tpXV0sIHNjb3Blc1trZXlzLmluZGV4T2Yoc2FtZXNbaV0pXSk7XG4gICAgfVxuICAgIHRlbXBsYXRlRWwuX3hfcHJldktleXMgPSBrZXlzO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHBhcnNlRm9yRXhwcmVzc2lvbihleHByZXNzaW9uKSB7XG4gIGxldCBmb3JJdGVyYXRvclJFID0gLywoW14sXFx9XFxdXSopKD86LChbXixcXH1cXF1dKikpPyQvO1xuICBsZXQgc3RyaXBQYXJlbnNSRSA9IC9eXFxzKlxcKHxcXClcXHMqJC9nO1xuICBsZXQgZm9yQWxpYXNSRSA9IC8oW1xcc1xcU10qPylcXHMrKD86aW58b2YpXFxzKyhbXFxzXFxTXSopLztcbiAgbGV0IGluTWF0Y2ggPSBleHByZXNzaW9uLm1hdGNoKGZvckFsaWFzUkUpO1xuICBpZiAoIWluTWF0Y2gpXG4gICAgcmV0dXJuO1xuICBsZXQgcmVzID0ge307XG4gIHJlcy5pdGVtcyA9IGluTWF0Y2hbMl0udHJpbSgpO1xuICBsZXQgaXRlbSA9IGluTWF0Y2hbMV0ucmVwbGFjZShzdHJpcFBhcmVuc1JFLCBcIlwiKS50cmltKCk7XG4gIGxldCBpdGVyYXRvck1hdGNoID0gaXRlbS5tYXRjaChmb3JJdGVyYXRvclJFKTtcbiAgaWYgKGl0ZXJhdG9yTWF0Y2gpIHtcbiAgICByZXMuaXRlbSA9IGl0ZW0ucmVwbGFjZShmb3JJdGVyYXRvclJFLCBcIlwiKS50cmltKCk7XG4gICAgcmVzLmluZGV4ID0gaXRlcmF0b3JNYXRjaFsxXS50cmltKCk7XG4gICAgaWYgKGl0ZXJhdG9yTWF0Y2hbMl0pIHtcbiAgICAgIHJlcy5jb2xsZWN0aW9uID0gaXRlcmF0b3JNYXRjaFsyXS50cmltKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcy5pdGVtID0gaXRlbTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuZnVuY3Rpb24gZ2V0SXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMoaXRlcmF0b3JOYW1lcywgaXRlbSwgaW5kZXgsIGl0ZW1zKSB7XG4gIGxldCBzY29wZVZhcmlhYmxlcyA9IHt9O1xuICBpZiAoL15cXFsuKlxcXSQvLnRlc3QoaXRlcmF0b3JOYW1lcy5pdGVtKSAmJiBBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgbGV0IG5hbWVzID0gaXRlcmF0b3JOYW1lcy5pdGVtLnJlcGxhY2UoXCJbXCIsIFwiXCIpLnJlcGxhY2UoXCJdXCIsIFwiXCIpLnNwbGl0KFwiLFwiKS5tYXAoKGkpID0+IGkudHJpbSgpKTtcbiAgICBuYW1lcy5mb3JFYWNoKChuYW1lLCBpKSA9PiB7XG4gICAgICBzY29wZVZhcmlhYmxlc1tuYW1lXSA9IGl0ZW1baV07XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoL15cXHsuKlxcfSQvLnRlc3QoaXRlcmF0b3JOYW1lcy5pdGVtKSAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIikge1xuICAgIGxldCBuYW1lcyA9IGl0ZXJhdG9yTmFtZXMuaXRlbS5yZXBsYWNlKFwie1wiLCBcIlwiKS5yZXBsYWNlKFwifVwiLCBcIlwiKS5zcGxpdChcIixcIikubWFwKChpKSA9PiBpLnRyaW0oKSk7XG4gICAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgc2NvcGVWYXJpYWJsZXNbbmFtZV0gPSBpdGVtW25hbWVdO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHNjb3BlVmFyaWFibGVzW2l0ZXJhdG9yTmFtZXMuaXRlbV0gPSBpdGVtO1xuICB9XG4gIGlmIChpdGVyYXRvck5hbWVzLmluZGV4KVxuICAgIHNjb3BlVmFyaWFibGVzW2l0ZXJhdG9yTmFtZXMuaW5kZXhdID0gaW5kZXg7XG4gIGlmIChpdGVyYXRvck5hbWVzLmNvbGxlY3Rpb24pXG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5jb2xsZWN0aW9uXSA9IGl0ZW1zO1xuICByZXR1cm4gc2NvcGVWYXJpYWJsZXM7XG59XG5mdW5jdGlvbiBpc051bWVyaWMzKHN1YmplY3QpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5KHN1YmplY3QpICYmICFpc05hTihzdWJqZWN0KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1yZWYuanNcbmZ1bmN0aW9uIGhhbmRsZXIyKCkge1xufVxuaGFuZGxlcjIuaW5saW5lID0gKGVsLCB7ZXhwcmVzc2lvbn0sIHtjbGVhbnVwOiBjbGVhbnVwMn0pID0+IHtcbiAgbGV0IHJvb3QgPSBjbG9zZXN0Um9vdChlbCk7XG4gIGlmICghcm9vdC5feF9yZWZzKVxuICAgIHJvb3QuX3hfcmVmcyA9IHt9O1xuICByb290Ll94X3JlZnNbZXhwcmVzc2lvbl0gPSBlbDtcbiAgY2xlYW51cDIoKCkgPT4gZGVsZXRlIHJvb3QuX3hfcmVmc1tleHByZXNzaW9uXSk7XG59O1xuZGlyZWN0aXZlKFwicmVmXCIsIGhhbmRsZXIyKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pZi5qc1xuZGlyZWN0aXZlKFwiaWZcIiwgKGVsLCB7ZXhwcmVzc2lvbn0sIHtlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGxldCBzaG93ID0gKCkgPT4ge1xuICAgIGlmIChlbC5feF9jdXJyZW50SWZFbClcbiAgICAgIHJldHVybiBlbC5feF9jdXJyZW50SWZFbDtcbiAgICBsZXQgY2xvbmUyID0gZWwuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgYWRkU2NvcGVUb05vZGUoY2xvbmUyLCB7fSwgZWwpO1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBlbC5hZnRlcihjbG9uZTIpO1xuICAgICAgaW5pdFRyZWUoY2xvbmUyKTtcbiAgICB9KTtcbiAgICBlbC5feF9jdXJyZW50SWZFbCA9IGNsb25lMjtcbiAgICBlbC5feF91bmRvSWYgPSAoKSA9PiB7XG4gICAgICB3YWxrKGNsb25lMiwgKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKCEhbm9kZS5feF9lZmZlY3RzKSB7XG4gICAgICAgICAgbm9kZS5feF9lZmZlY3RzLmZvckVhY2goZGVxdWV1ZUpvYik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY2xvbmUyLnJlbW92ZSgpO1xuICAgICAgZGVsZXRlIGVsLl94X2N1cnJlbnRJZkVsO1xuICAgIH07XG4gICAgcmV0dXJuIGNsb25lMjtcbiAgfTtcbiAgbGV0IGhpZGUgPSAoKSA9PiB7XG4gICAgaWYgKCFlbC5feF91bmRvSWYpXG4gICAgICByZXR1cm47XG4gICAgZWwuX3hfdW5kb0lmKCk7XG4gICAgZGVsZXRlIGVsLl94X3VuZG9JZjtcbiAgfTtcbiAgZWZmZWN0MygoKSA9PiBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgdmFsdWUgPyBzaG93KCkgOiBoaWRlKCk7XG4gIH0pKTtcbiAgY2xlYW51cDIoKCkgPT4gZWwuX3hfdW5kb0lmICYmIGVsLl94X3VuZG9JZigpKTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWlkLmpzXG5kaXJlY3RpdmUoXCJpZFwiLCAoZWwsIHtleHByZXNzaW9ufSwge2V2YWx1YXRlOiBldmFsdWF0ZTJ9KSA9PiB7XG4gIGxldCBuYW1lcyA9IGV2YWx1YXRlMihleHByZXNzaW9uKTtcbiAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4gc2V0SWRSb290KGVsLCBuYW1lKSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1vbi5qc1xubWFwQXR0cmlidXRlcyhzdGFydGluZ1dpdGgoXCJAXCIsIGludG8ocHJlZml4KFwib246XCIpKSkpO1xuZGlyZWN0aXZlKFwib25cIiwgc2tpcER1cmluZ0Nsb25lKChlbCwge3ZhbHVlLCBtb2RpZmllcnMsIGV4cHJlc3Npb259LCB7Y2xlYW51cDogY2xlYW51cDJ9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBleHByZXNzaW9uID8gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbikgOiAoKSA9PiB7XG4gIH07XG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidGVtcGxhdGVcIikge1xuICAgIGlmICghZWwuX3hfZm9yd2FyZEV2ZW50cylcbiAgICAgIGVsLl94X2ZvcndhcmRFdmVudHMgPSBbXTtcbiAgICBpZiAoIWVsLl94X2ZvcndhcmRFdmVudHMuaW5jbHVkZXModmFsdWUpKVxuICAgICAgZWwuX3hfZm9yd2FyZEV2ZW50cy5wdXNoKHZhbHVlKTtcbiAgfVxuICBsZXQgcmVtb3ZlTGlzdGVuZXIgPSBvbihlbCwgdmFsdWUsIG1vZGlmaWVycywgKGUpID0+IHtcbiAgICBldmFsdWF0ZTIoKCkgPT4ge1xuICAgIH0sIHtzY29wZTogeyRldmVudDogZX0sIHBhcmFtczogW2VdfSk7XG4gIH0pO1xuICBjbGVhbnVwMigoKSA9PiByZW1vdmVMaXN0ZW5lcigpKTtcbn0pKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMvaW5kZXguanNcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiQ29sbGFwc2VcIiwgXCJjb2xsYXBzZVwiLCBcImNvbGxhcHNlXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJJbnRlcnNlY3RcIiwgXCJpbnRlcnNlY3RcIiwgXCJpbnRlcnNlY3RcIik7XG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIkZvY3VzXCIsIFwidHJhcFwiLCBcImZvY3VzXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJNYXNrXCIsIFwibWFza1wiLCBcIm1hc2tcIik7XG5mdW5jdGlvbiB3YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShuYW1lLCBkaXJlY3RpdmVOYW1lMiwgc2x1Zykge1xuICBkaXJlY3RpdmUoZGlyZWN0aXZlTmFtZTIsIChlbCkgPT4gd2FybihgWW91IGNhbid0IHVzZSBbeC0ke2RpcmVjdGl2ZU5hbWUyfV0gd2l0aG91dCBmaXJzdCBpbnN0YWxsaW5nIHRoZSBcIiR7bmFtZX1cIiBwbHVnaW4gaGVyZTogaHR0cHM6Ly9hbHBpbmVqcy5kZXYvcGx1Z2lucy8ke3NsdWd9YCwgZWwpKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2luZGV4LmpzXG5hbHBpbmVfZGVmYXVsdC5zZXRFdmFsdWF0b3Iobm9ybWFsRXZhbHVhdG9yKTtcbmFscGluZV9kZWZhdWx0LnNldFJlYWN0aXZpdHlFbmdpbmUoe3JlYWN0aXZlOiByZWFjdGl2ZTIsIGVmZmVjdDogZWZmZWN0MiwgcmVsZWFzZTogc3RvcCwgcmF3OiB0b1Jhd30pO1xudmFyIHNyY19kZWZhdWx0ID0gYWxwaW5lX2RlZmF1bHQ7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL2J1aWxkcy9tb2R1bGUuanNcbnZhciBtb2R1bGVfZGVmYXVsdCA9IHNyY19kZWZhdWx0O1xuZXhwb3J0IHtcbiAgbW9kdWxlX2RlZmF1bHQgYXMgZGVmYXVsdFxufTtcbiIsICJpbXBvcnQgQWxwaW5lIGZyb20gJ2FscGluZWpzJztcblxuY29uc3QgRkVBVFVSRVMgPSBbXG4gICAgW1xuICAgICAgICAnZGVsZWdhdGlvbicsXG4gICAgICAgICdOSVAtMjYgRGVsZWdhdGlvbiBQcm9maWxlcycsXG4gICAgICAgICdBbGxvdyB1c2VyIHRvIGNyZWF0ZSBkZWxlZ2F0ZWQgcHJvZmlsZXMgdGhhdCBvYmV5IHRoZSBOSVAtMjYgc3RhbmRhcmQuIFJlcXVpcmVzIGNsaWVudCBzdXBwb3J0LicsXG4gICAgXSxcbl07XG5cbkFscGluZS5kYXRhKCdleHBlcmltZW50YWwnLCAoKSA9PiAoe1xuICAgIGZlYXR1cmVzOiBbXSxcblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMucmVsb2FkRmVhdHVyZXMoKTtcblxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZlYXR1cmVzKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgcmVsb2FkRmVhdHVyZXMoKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIEZFQVRVUkVTLm1hcChhc3luYyAoW25hbWUsIHNob3J0RGVzYywgbG9uZ0Rlc2NdKSA9PiB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IGBmZWF0dXJlOiR7bmFtZX1gO1xuICAgICAgICAgICAgICAgIGxldCBhY3RpdmUgPSBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgW25hbWVdOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhY3RpdmUgPSBhY3RpdmVbbmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtuYW1lLCBhY3RpdmUsIHNob3J0RGVzYywgbG9uZ0Rlc2NdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgY2hhbmdlKGZlYXR1cmUsIGFjdGl2ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhmZWF0dXJlLCBhY3RpdmUpO1xuICAgICAgICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KHsgW2ZlYXR1cmVdOiBhY3RpdmUgfSk7XG4gICAgICAgIGF3YWl0IHRoaXMucmVsb2FkRmVhdHVyZXMoKTtcbiAgICB9LFxufSkpO1xuXG5BbHBpbmUuc3RhcnQoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQ0EsTUFBSSxlQUFlO0FBQ25CLE1BQUksV0FBVztBQUNmLE1BQUksUUFBUSxDQUFDO0FBQ2IsV0FBUyxVQUFVLFVBQVU7QUFDM0IsYUFBUyxR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
