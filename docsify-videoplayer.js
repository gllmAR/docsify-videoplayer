(function() {
  // Function to check if a URL is a video link based on its extension
  function isVideoLink(url, videoExtensions) {
    const ext = url.split('.').pop().toLowerCase();
    console.log(`Checking if ${url} is a video link with extension ${ext}`);
    return videoExtensions.includes(ext);
  }

  // Function to create a video player element with an optional poster
  function createVideoPlayer(url, type, posterUrl) {
    console.log(`Creating video player for URL: ${url}, Type: ${type}, Poster: ${posterUrl}`);
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('controls', '');
    videoPlayer.setAttribute('playsinline', '');
    videoPlayer.setAttribute('width', '100%');
    videoPlayer.setAttribute('height', 'auto');
    videoPlayer.style.maxWidth = '100%';

    if (posterUrl) {
      videoPlayer.setAttribute('poster', posterUrl);
    }

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

    const resolvedUrl = new URL(url, basePath + '/').href;
    console.log(`Resolving relative URL: ${url} to ${resolvedUrl}`);
    return resolvedUrl;
  }

  // Function to replace custom markdown with video players
  function replaceCustomMarkdown(videoExtensions) {
    console.log('Processing custom markdown for video players');
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const img = link.querySelector('img');
      if (img) {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        console.log(`Processing embedded video with poster: video URL: ${href}, poster URL: ${src}`);
        if (isVideoLink(href, videoExtensions)) {
          const videoPlayer = createVideoPlayer(resolveRelativeUrl(href), `video/${href.split('.').pop().toLowerCase()}`, resolveRelativeUrl(src));
          link.parentNode.replaceChild(videoPlayer, link);
        }
      }
    });
  }

  // Function to replace video links and images with video players
  function replaceVideoLinksAndImages(videoExtensions, parseGithubLinks) {
    console.log('Processing video links and images');
    // Process anchor tags
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      let url = link.getAttribute('href');
      console.log(`Processing anchor link: ${url}`);
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
      console.log(`Processing img tag with src: ${url}`);
      if (isVideoLink(url, videoExtensions)) {
        const videoPlayer = createVideoPlayer(resolveRelativeUrl(url), `video/${url.split('.').pop().toLowerCase()}`);
        img.parentNode.replaceChild(videoPlayer, img);
      }
    });

    // Process custom markdown syntax
    replaceCustomMarkdown(videoExtensions);
  }

  // Docsify plugin integration
  function initDocsifyVideoPlayerPlugin(hook, vm) {
    const defaultVideoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mkv'];
    const userVideoExtensions = vm.config.videoExtensions || [];
    const videoExtensions = defaultVideoExtensions.concat(userVideoExtensions);
    const parseGithubLinks = vm.config.parseGithubLinks !== false;

    hook.doneEach(() => {
      console.log('Docsify hook doneEach triggered');
      replaceVideoLinksAndImages(videoExtensions, parseGithubLinks);
    });
  }

  // Register the plugin with Docsify
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(initDocsifyVideoPlayerPlugin);
})();
