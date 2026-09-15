export default function Annotations({ annotations }) {
  function annotationsLister(annotations) {
    const annotationsList = [];
    console.log(annotations);

    for (const key in annotations) {
      console.log(key);
      console.log(annotations[key]);

      if (key == "clothing") {
        for (const clothingItem in annotations[key])
          annotationsList.push(
            <li
              key={`${key}${annotations[key][clothingItem]}`}
              className="annotation-item"
            >
              <div
                className="annotation-item-color"
                style={{ backgroundColor: annotations[key][clothingItem] }}
              ></div>
              {clothingItem}
            </li>
          );
      } else {
        annotationsList.push(
          <li key={`${key}${annotations[key]}`} className="annotation-item">
            <div>{key}:</div>
            {annotations[key]}
          </li>
        );
      }
    }
    console.log(annotationsList);
    return annotationsList;
  }
  return (
    <ul className="annotation-list">
      {annotationsLister(annotations).map((annotation, i) => {
        return annotation;
      })}
    </ul>
  );
}
`<ul className="annotation-list">
      {Object.keys(annotations).map((annotation, i) => {
        return (
          <li key={i} className="annotation-item">
            <div
              className="annotation-item-color"
              style={{ backgroundColor: annotations[annotation] }}
            ></div>
            {annotation}
          </li>
        );
      })}
    </ul>`;
