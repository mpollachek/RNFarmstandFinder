export const getGeoLocationJS = () => {
  const getCurrentPosition = `
    navigator.geolocation.getCurrentPosition = (success, error, options) => {
      console.log("injected into android emulator");
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'getCurrentPosition' }));

      window.addEventListener('message', (e) => {
        let eventData = {}
        try {
          eventData = JSON.parse(e.data);
          console.log("eventData", eventData)
          console.log("e", e)
        } catch (e) {}

        if (eventData.event === 'currentPosition') {
          navigator.geolocation.getCurrentPosition((position) => {
            setMapCenter([position.coords.latitude, position.coords.longitude]);
          });
          success(eventData.data);
        } else if (eventData.event === 'currentPositionError') {
          error(eventData.data);
        }
      });
    };
    true;
  `;

  return `
    (function() {
      ${getCurrentPosition}
    })();
  `;
};