(function() {
  // Function to check if a URL is a video link based on its extension
  function isVideoLink(url, videoExtensions) {
    const ext = url.split('.').pop().toLowerCase();
    return videoExtensions.includes(ext);
  }

  // Function to create a video player element
  function createVideoPlayer(url, type) {
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('controls', '');
    videoPlayer.setAttribute('playsinline', '');
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

  // Function to resolve relative URLs for links based on the current document location
  function resolveRelativeUrl(url) {
    const currentUrl = window.location.href;
    const hashIndex = currentUrl.indexOf('#');
    let basePath = currentUrl;

    if (hashIndex !== -1) {
      basePath = currentUrl.substring(0, hashIndex) + currentUrl.substring(hashIndex + 1, currentUrl.lastIndexOf('/'));
    }

    return new URL(url, basePath + '/').href;
  }

  // Function to replace video links and images with video players
  function replaceVideoLinksAndImages(videoExtensions, parseGithubLinks) {
    // Process anchor tags
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      let url = link.getAttribute('href');
      if (parseGithubLinks && url.includes('github.com') && url.includes('assets')) {
        // Assume GitHub asset links are videos
        url = resolveRelativeUrl(url.replace('#/', ''));
        const videoPlayer = createVideoPlayer(url, 'video/mp4');
        link.parentNode.replaceChild(videoPlayer, link);
      } else if (isVideoLink(url, videoExtensions)) {
        url = resolveRelativeUrl(url.replace('#/', ''));
        const videoPlayer = createVideoPlayer(url, `video/${url.split('.').pop().toLowerCase()}`);
        link.parentNode.replaceChild(videoPlayer, link);
      }
    });

    // Process image tags
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      let url = img.getAttribute('src');
      if (isVideoLink(url, videoExtensions)) {
        url = resolveRelativeUrl(url.replace('#/', ''));
        const videoPlayer = createVideoPlayer(url, `video/${url.split('.').pop().toLowerCase()}`);
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

  // Register the plugin with Docsify
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(initDocsifyVideoPlayerPlugin);
})();
