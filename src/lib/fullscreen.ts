export const requestFullscreen = (
  el: HTMLDivElement,
  videoEl: HTMLVideoElement
) => {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (videoEl.requestFullscreen) {
    videoEl.requestFullscreen();
  }
};

export const requestFullscreenIfSupported = (
  el: HTMLDivElement,
  videoEl: HTMLVideoElement
) => {
  if (!document.fullscreenEnabled) return;

  return requestFullscreen(el, videoEl);
};

export const exitFullscreen = () => {
  if (!document.exitFullscreen) return;

  return document.exitFullscreen();
};
