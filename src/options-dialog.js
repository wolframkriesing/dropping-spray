function setupOptions() {

  var hider = document.getElementById('options-hider');
  var options = document.getElementById('options-content');

  hider.addEventListener('click', toggleOptions);

  var isHidden = false;

  function toggleOptions() {
    isHidden = !isHidden;
    if (isHidden) {
      options.style.display = 'none';
      hider.innerHTML = 'Open options';
      hider.classList.add('open');
    } else {
      options.style.display = 'block';
      hider.innerHTML = 'close';
      hider.classList.remove('open');
    }
  }

}

module.exports = {
  setupOptions: setupOptions
};