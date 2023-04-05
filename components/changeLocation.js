export const changeLocation = () => {

    const getCurrentPosition = `
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("testing webview logs")
    setMapCenter([position.coords.latitude, position.coords.longitude]);
  });
  true;
  `;
  return `
    (function() {
      ${getCurrentPosition}
    })();
  `;
}