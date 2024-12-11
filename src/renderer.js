document.addEventListener('DOMContentLoaded', () => {
  console.log('Renderer script loaded');

  const urlInput = document.getElementById('url');
  const goButton = document.getElementById('go');
  const backButton = document.getElementById('back');
  const forwardButton = document.getElementById('forward');
  const refreshButton = document.getElementById('refresh');
  const bookmarkButton = document.getElementById('bookmark');
  const bookmarksList = document.getElementById('bookmarks');
  const webview = document.getElementById('webview');
  const spinner = document.getElementById('spinner');

  let history = [];
  let historyIndex = -1;
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

  // Initialize bookmarks
  bookmarks.forEach(addBookmarkToList);

  goButton.addEventListener('click', () => {
    const url = urlInput.value;
    console.log(`Go button clicked, URL: ${url}`);
    showSpinner();
    webview.src = url;
    addToHistory(url);
  });

  backButton.addEventListener('click', () => {
    if (historyIndex > 0) {
      historyIndex--;
      const url = history[historyIndex];
      console.log(`Back button clicked, navigating to: ${url}`);
      showSpinner();
      webview.src = url;
      urlInput.value = url;
    }
  });

  forwardButton.addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      const url = history[historyIndex];
      console.log(`Forward button clicked, navigating to: ${url}`);
      showSpinner();
      webview.src = url;
      urlInput.value = url;
    }
  });

  refreshButton.addEventListener('click', () => {
    console.log('Refresh button clicked');
    showSpinner();
    webview.reload();
  });

  bookmarkButton.addEventListener('click', () => {
    const url = urlInput.value;
    console.log(`Bookmark button clicked, URL: ${url}`);
    if (bookmarks.includes(url)) return;
    bookmarks.push(url);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    addBookmarkToList(url);
  });

  bookmarksList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      const url = event.target.textContent;
      console.log(`Bookmark clicked, URL: ${url}`);
      urlInput.value = url;
      webview.src = url;
    }
  });

  webview.addEventListener('did-start-loading', () => {
    console.log('Page started loading');
    showSpinner();
  });

  webview.addEventListener('did-stop-loading', () => {
    console.log('Page finished loading');
    hideSpinner();
  });

  webview.addEventListener('did-navigate', (event) => {
    console.log(`Navigated to: ${event.url}`);
    urlInput.value = event.url;
  });

  webview.addEventListener('did-fail-load', (event) => {
    console.error(`Failed to load ${event.validatedURL}: ${event.errorDescription}`);
    hideSpinner();
  });

  function addToHistory(url) {
    if (historyIndex === history.length - 1) {
      history.push(url);
    } else {
      history = history.slice(0, historyIndex + 1);
      history.push(url);
    }
    historyIndex = history.length - 1;
    console.log(`History updated: ${history}`);
  }

  function addBookmarkToList(url) {
    const li = document.createElement('li');
    li.textContent = url;
    bookmarksList.appendChild(li);
  }

  function showSpinner() {
    spinner.style.display = 'block';
  }

  function hideSpinner() {
    spinner.style.display = 'none';
  }
});
