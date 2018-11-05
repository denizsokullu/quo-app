const computeRatio = (element,container) => {

  let c = container
  let e = element

  let rInner = e.w/e.h;
  let rContainer = c.w / c.h;

  return rContainer > rInner ? { w: parseInt(e.w * c.h / e.h), h: parseInt(c.h) } : { w: parseInt(c.w), h: parseInt(e.h * c.w / e.w) }

}

const convertSnapshot = (origElem, width, height, left, top) => {

  left = (left || 0);
  top = (top || 0);

  var elem = origElem.cloneNode(true);

  // unfortunately, SVG can only eat well formed XHTML
  elem.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

  // serialize the DOM node to a String
  var serialized = new XMLSerializer().serializeToString(elem);

  // Create well formed data URL with our DOM string wrapped in SVG
  return "data:image/svg+xml," +
    "<svg xmlns='http://www.w3.org/2000/svg' width='" + ((width || origElem.offsetWidth) + left) + "' height='" + ((height || origElem.offsetHeight) + top) + "'>" +
      "<foreignObject width='100%' height='100%' x='" + left + "' y='" + top + "'>" +
      serialized +
      "</foreignObject>" +
    "</svg>";
}

const convertSnapshotToImage = (data, callback) => {

  let { id, eDimensions, cDimensions, full } = data;

  let snapshot = document.getElementById(`snapshot-${id}`);

  if(full) return {image: convertSnapshot(snapshot, eDimensions.w, eDimensions.h)};

  let suitableDimensions = computeRatio(eDimensions, cDimensions);
  //don't make things bigger, just resize them down.
  if( eDimensions.w < cDimensions.w && eDimensions.h < cDimensions.h ){
    suitableDimensions = eDimensions;
  }

  let scale = Math.min(1, Math.max(suitableDimensions.w / eDimensions.w,  suitableDimensions.h / eDimensions.h));

  return {image: convertSnapshot(snapshot, eDimensions.w, eDimensions.h), scale: scale};

}

export { convertSnapshotToImage }