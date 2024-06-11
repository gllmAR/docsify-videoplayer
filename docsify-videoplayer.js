(function() {
  function isVideoLink(url, videoExtensions) {
    const ext = url.split('.').pop().toLowerCase();
    return videoExtensions.includes(ext);
  }

  function createVideoPlayer(url) {
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('controls', '');
    videoPlayer.setAttribute('width', '100%');
    videoPlayer.setAttribute('height', 'auto');
    videoPlayer.style.maxWidth = '100%';

    const source = document.createElement('source');
    source.setAttribute('src', url);
    source.setAttribute('type', `video/${url.split('.').pop().toLowerCase()}`);
    videoPlayer.appendChild(source);

    const fallbackText = document.createTextNode('Your browser does not support the video tag.');
    videoPlayer.appendChild(fallbackText);

    return videoPlayer;
  }

  function replaceVideoImages(videoExtensions) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const url = img.getAttribute('src');
      if (isVideoLink(url, videoExtensions)) {
        const videoPlayer = createVideoPlayer(url.replace('#/', ''));
        img.parentNode.replaceChild(videoPlayer, img);
      }
    });
  }

  // Docsify plugin integration
  function initDocsifyVideoPlayerPlugin(hook, vm) {
    const defaultVideoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mkv'];
    const userVideoExtensions = vm.config.videoExtensions || [];
    const videoExtensions = defaultVideoExtensions.concat(userVideoExtensions);

    hook.doneEach(() => {
      replaceVideoImages(videoExtensions);
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(initDocsifyVideoPlayerPlugin);
})();
