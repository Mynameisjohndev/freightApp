import * as React from 'react';

export const navigationRef = React.createRef();

export default function navigate(name: string, params?: string[]) {
  navigationRef?.current?.navigate(name, params);
}
