function getHtml( htmlPatch ) {
  return $.get( htmlPatch, { async: false }, 'html');
}
