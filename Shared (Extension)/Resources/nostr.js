(() => {
  // Shared (Extension)/Resources/nostr.js
  window.nostr = {
    requests: {},
    async getPublicKey() {
      return await this.broadcast("getPubKey");
    },
    async signEvent(event) {
      return await this.broadcast("signEvent", event);
    },
    async getRelays() {
      return await this.broadcast("getRelays");
    },
    // This is here for Alby comatibility. This is not part of the NIP-07 standard.
    // I have found at least one site, nostr.band, which expects it to be present.
    async enable() {
      return { enabled: true };
    },
    broadcast(kind, payload) {
      let reqId = Math.random().toString();
      return new Promise((resolve, _reject) => {
        this.requests[reqId] = resolve;
        window.postMessage({ kind, reqId, payload }, "*");
      });
    },
    nip04: {
      async encrypt(pubKey, plainText) {
        return await window.nostr.broadcast("nip04.encrypt", {
          pubKey,
          plainText
        });
      },
      async decrypt(pubKey, cipherText) {
        return await window.nostr.broadcast("nip04.decrypt", {
          pubKey,
          cipherText
        });
      }
    }
  };
  window.addEventListener("message", (message) => {
    const validEvents = [
      "getPubKey",
      "signEvent",
      "getRelays",
      "nip04.encrypt",
      "nip04.decrypt"
    ].map((e) => `return_${e}`);
    let { kind, reqId, payload } = message.data;
    if (!validEvents.includes(kind))
      return;
    window.nostr.requests[reqId]?.(payload);
    delete window.nostr.requests[reqId];
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9zdHIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIndpbmRvdy5ub3N0ciA9IHtcbiAgICByZXF1ZXN0czoge30sXG5cbiAgICBhc3luYyBnZXRQdWJsaWNLZXkoKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmJyb2FkY2FzdCgnZ2V0UHViS2V5Jyk7XG4gICAgfSxcblxuICAgIGFzeW5jIHNpZ25FdmVudChldmVudCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5icm9hZGNhc3QoJ3NpZ25FdmVudCcsIGV2ZW50KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZ2V0UmVsYXlzKCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5icm9hZGNhc3QoJ2dldFJlbGF5cycpO1xuICAgIH0sXG5cbiAgICAvLyBUaGlzIGlzIGhlcmUgZm9yIEFsYnkgY29tYXRpYmlsaXR5LiBUaGlzIGlzIG5vdCBwYXJ0IG9mIHRoZSBOSVAtMDcgc3RhbmRhcmQuXG4gICAgLy8gSSBoYXZlIGZvdW5kIGF0IGxlYXN0IG9uZSBzaXRlLCBub3N0ci5iYW5kLCB3aGljaCBleHBlY3RzIGl0IHRvIGJlIHByZXNlbnQuXG4gICAgYXN5bmMgZW5hYmxlKCkge1xuICAgICAgICByZXR1cm4geyBlbmFibGVkOiB0cnVlIH07XG4gICAgfSxcblxuICAgIGJyb2FkY2FzdChraW5kLCBwYXlsb2FkKSB7XG4gICAgICAgIGxldCByZXFJZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCBfcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RzW3JlcUlkXSA9IHJlc29sdmU7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoeyBraW5kLCByZXFJZCwgcGF5bG9hZCB9LCAnKicpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgbmlwMDQ6IHtcbiAgICAgICAgYXN5bmMgZW5jcnlwdChwdWJLZXksIHBsYWluVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHdpbmRvdy5ub3N0ci5icm9hZGNhc3QoJ25pcDA0LmVuY3J5cHQnLCB7XG4gICAgICAgICAgICAgICAgcHViS2V5LFxuICAgICAgICAgICAgICAgIHBsYWluVGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFzeW5jIGRlY3J5cHQocHViS2V5LCBjaXBoZXJUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgd2luZG93Lm5vc3RyLmJyb2FkY2FzdCgnbmlwMDQuZGVjcnlwdCcsIHtcbiAgICAgICAgICAgICAgICBwdWJLZXksXG4gICAgICAgICAgICAgICAgY2lwaGVyVGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0sXG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG1lc3NhZ2UgPT4ge1xuICAgIGNvbnN0IHZhbGlkRXZlbnRzID0gW1xuICAgICAgICAnZ2V0UHViS2V5JyxcbiAgICAgICAgJ3NpZ25FdmVudCcsXG4gICAgICAgICdnZXRSZWxheXMnLFxuICAgICAgICAnbmlwMDQuZW5jcnlwdCcsXG4gICAgICAgICduaXAwNC5kZWNyeXB0JyxcbiAgICBdLm1hcChlID0+IGByZXR1cm5fJHtlfWApO1xuICAgIGxldCB7IGtpbmQsIHJlcUlkLCBwYXlsb2FkIH0gPSBtZXNzYWdlLmRhdGE7XG5cbiAgICBpZiAoIXZhbGlkRXZlbnRzLmluY2x1ZGVzKGtpbmQpKSByZXR1cm47XG5cbiAgICB3aW5kb3cubm9zdHIucmVxdWVzdHNbcmVxSWRdPy4ocGF5bG9hZCk7XG4gICAgZGVsZXRlIHdpbmRvdy5ub3N0ci5yZXF1ZXN0c1tyZXFJZF07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQUEsU0FBTyxRQUFRO0FBQUEsSUFDWCxVQUFVLENBQUM7QUFBQSxJQUVYLE1BQU0sZUFBZTtBQUNqQixhQUFPLE1BQU0sS0FBSyxVQUFVLFdBQVc7QUFBQSxJQUMzQztBQUFBLElBRUEsTUFBTSxVQUFVLE9BQU87QUFDbkIsYUFBTyxNQUFNLEtBQUssVUFBVSxhQUFhLEtBQUs7QUFBQSxJQUNsRDtBQUFBLElBRUEsTUFBTSxZQUFZO0FBQ2QsYUFBTyxNQUFNLEtBQUssVUFBVSxXQUFXO0FBQUEsSUFDM0M7QUFBQTtBQUFBO0FBQUEsSUFJQSxNQUFNLFNBQVM7QUFDWCxhQUFPLEVBQUUsU0FBUyxLQUFLO0FBQUEsSUFDM0I7QUFBQSxJQUVBLFVBQVUsTUFBTSxTQUFTO0FBQ3JCLFVBQUksUUFBUSxLQUFLLE9BQU8sRUFBRSxTQUFTO0FBQ25DLGFBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxZQUFZO0FBQ3JDLGFBQUssU0FBUyxLQUFLLElBQUk7QUFDdkIsZUFBTyxZQUFZLEVBQUUsTUFBTSxPQUFPLFFBQVEsR0FBRyxHQUFHO0FBQUEsTUFDcEQsQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUVBLE9BQU87QUFBQSxNQUNILE1BQU0sUUFBUSxRQUFRLFdBQVc7QUFDN0IsZUFBTyxNQUFNLE9BQU8sTUFBTSxVQUFVLGlCQUFpQjtBQUFBLFVBQ2pEO0FBQUEsVUFDQTtBQUFBLFFBQ0osQ0FBQztBQUFBLE1BQ0w7QUFBQSxNQUVBLE1BQU0sUUFBUSxRQUFRLFlBQVk7QUFDOUIsZUFBTyxNQUFNLE9BQU8sTUFBTSxVQUFVLGlCQUFpQjtBQUFBLFVBQ2pEO0FBQUEsVUFDQTtBQUFBLFFBQ0osQ0FBQztBQUFBLE1BQ0w7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUVBLFNBQU8saUJBQWlCLFdBQVcsYUFBVztBQUMxQyxVQUFNLGNBQWM7QUFBQSxNQUNoQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNKLEVBQUUsSUFBSSxPQUFLLFVBQVUsR0FBRztBQUN4QixRQUFJLEVBQUUsTUFBTSxPQUFPLFFBQVEsSUFBSSxRQUFRO0FBRXZDLFFBQUksQ0FBQyxZQUFZLFNBQVMsSUFBSTtBQUFHO0FBRWpDLFdBQU8sTUFBTSxTQUFTLEtBQUssSUFBSSxPQUFPO0FBQ3RDLFdBQU8sT0FBTyxNQUFNLFNBQVMsS0FBSztBQUFBLEVBQ3RDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
