(function() {
  function isVideoLink(url, videoExtensions) {
    const ext = url.split('.').pop().toLowerCase();
    return videoExtensions.includes(ext);
  }

  function createVideoPlayer(url, type) {
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('controls', '');
    videoPlayer.setAttribute('width', '100%');
    videoPlayer.setAttribute('height', 'auto');
    videoPlayer.style.maxWidth = '100%';

    const source = document.createElement('source');
    source.setAttribute('src', url);
    source.setAttribute('type', type);
    videoPlayer.appendChild(source);

    const fallbackText = document.createTextNode('Your browser does not support the video tag.');
    videoPlayer.appendChild(fallbackText);

    return videoPlayer;
  }

  function replaceVideoLinksAndImages(videoExtensions, parseGithubLinks) {
    // Process anchor tags
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const url = link.getAttribute('href');
      if (parseGithubLinks && url.includes('github.com') && url.includes('assets')) {
        // Assume GitHub asset links are videos
        const videoPlayer = createVideoPlayer(url.replace('#/', ''), 'video/mp4');
        link.parentNode.replaceChild(videoPlayer, link);
      } else if (isVideoLink(url, videoExtensions)) {
        const videoPlayer = createVideoPlayer(url.replace('#/', ''), `video/${url.split('.').pop().toLowerCase()}`);
        link.parentNode.replaceChild(videoPlayer, link);
      }
    });

    // Process image tags
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const url = img.getAttribute('src');
      if (isVideoLink(url, videoExtensions)) {
        const videoPlayer = createVideoPlayer(url.replace('#/', ''), `video/${url.split('.').pop().toLowerCase()}`);
        img.parentNode.replaceChild(videoPlayer, img);
      }
    });
  }

  // Docsify plugin integration
  function initDocsifyVideoPlayerPlugin(hook, vm) {
    const defaultVideoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mkv'];
    const userVideoExtensions = vm.config.videoExtensions || [];
    const videoExtensions = defaultVideoExtensions.concat(userVideoExtensions);
    const parseGithubLinks = vm.config.parseGithubLinks !== false;

    hook.doneEach(() => {
      replaceVideoLinksAndImages(videoExtensions, parseGithubLinks);
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(initDocsifyVideoPlayerPlugin);
})();
