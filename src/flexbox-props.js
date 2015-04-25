const flexboxProperties = new Set([
    'flexDirection',
    'justifyContent',
    'alignItems',
    'alignSelf',
    'position',
    'flexWrap',
    'flex',
    'width',
    'height',
    'maxWidth',
    'maxHeight',
    'minWidth',
    'minHeight',
    'margin',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'padding',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'borderWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'borderBottomWidth',
    'left',
    'top',
    'right',
    'bottom'
  ]);

  export default function isFlexBoxProperty (propertyName) {
    return flexboxProperties.has(propertyName);
  }
