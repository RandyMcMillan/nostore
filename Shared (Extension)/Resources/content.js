(() => {
  // Shared (Extension)/Resources/content.js
  var script = document.createElement("script");
  script.setAttribute("src", browser.runtime.getURL("nostr.build.js"));
  document.body.appendChild(script);
  window.addEventListener("message", async (message) => {
    const validEvents = [
      "getPubKey",
      "signEvent",
      "getRelays",
      "nip04.encrypt",
      "nip04.decrypt"
    ];
    let { kind, reqId, payload } = message.data;
    if (!validEvents.includes(kind))
      return;
    payload = await browser.runtime.sendMessage({
      kind,
      payload,
      host: window.location.host
    });
    console.log(payload);
    kind = `return_${kind}`;
    window.postMessage({ kind, reqId, payload }, "*");
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udGVudC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsibGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuc2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgYnJvd3Nlci5ydW50aW1lLmdldFVSTCgnbm9zdHIuYnVpbGQuanMnKSk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgYXN5bmMgbWVzc2FnZSA9PiB7XG4gICAgY29uc3QgdmFsaWRFdmVudHMgPSBbXG4gICAgICAgICdnZXRQdWJLZXknLFxuICAgICAgICAnc2lnbkV2ZW50JyxcbiAgICAgICAgJ2dldFJlbGF5cycsXG4gICAgICAgICduaXAwNC5lbmNyeXB0JyxcbiAgICAgICAgJ25pcDA0LmRlY3J5cHQnLFxuICAgIF07XG4gICAgbGV0IHsga2luZCwgcmVxSWQsIHBheWxvYWQgfSA9IG1lc3NhZ2UuZGF0YTtcbiAgICBpZiAoIXZhbGlkRXZlbnRzLmluY2x1ZGVzKGtpbmQpKSByZXR1cm47XG5cbiAgICBwYXlsb2FkID0gYXdhaXQgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAga2luZCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3QsXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2cocGF5bG9hZCk7XG5cbiAgICBraW5kID0gYHJldHVybl8ke2tpbmR9YDtcblxuICAgIHdpbmRvdy5wb3N0TWVzc2FnZSh7IGtpbmQsIHJlcUlkLCBwYXlsb2FkIH0sICcqJyk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQUEsTUFBSSxTQUFTLFNBQVMsY0FBYyxRQUFRO0FBQzVDLFNBQU8sYUFBYSxPQUFPLFFBQVEsUUFBUSxPQUFPLGdCQUFnQixDQUFDO0FBQ25FLFdBQVMsS0FBSyxZQUFZLE1BQU07QUFFaEMsU0FBTyxpQkFBaUIsV0FBVyxPQUFNLFlBQVc7QUFDaEQsVUFBTSxjQUFjO0FBQUEsTUFDaEI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDSjtBQUNBLFFBQUksRUFBRSxNQUFNLE9BQU8sUUFBUSxJQUFJLFFBQVE7QUFDdkMsUUFBSSxDQUFDLFlBQVksU0FBUyxJQUFJO0FBQUc7QUFFakMsY0FBVSxNQUFNLFFBQVEsUUFBUSxZQUFZO0FBQUEsTUFDeEM7QUFBQSxNQUNBO0FBQUEsTUFDQSxNQUFNLE9BQU8sU0FBUztBQUFBLElBQzFCLENBQUM7QUFDRCxZQUFRLElBQUksT0FBTztBQUVuQixXQUFPLFVBQVU7QUFFakIsV0FBTyxZQUFZLEVBQUUsTUFBTSxPQUFPLFFBQVEsR0FBRyxHQUFHO0FBQUEsRUFDcEQsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
