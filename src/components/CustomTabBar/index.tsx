import React from 'react';
import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import {
  Container,
  MenuItem,
  MenuItemCenter,
  Icon,
  IconBadge,
  IconBadgeText,
  MenuItemContent,
} from './styles';

export const CustomTabBar: React.FC<BottomTabBarProps<BottomTabBarOptions>> = ({
  state,
  descriptors,
  navigation,
}) => {
  const goTo = React.useCallback(
    (routeName: string) => {
      navigation.navigate(routeName);
    },
    [navigation],
  );

  function getIconName(routeName: string): string {
    switch (routeName) {
      case 'Home':
        return 'home';
      case 'MyFreights':
        return 'truck';
      case 'SearchFreights':
        return 'search';
      case 'Notifications':
        return 'bell';
      case 'Profile':
        return 'user';

      default:
        return 'home';
    }
  }

  return (
    <Container style={{ elevation: 10 }}>
      {state.routes.map((route, index) => {
        const iconName = getIconName(route.name);
        const { options } = descriptors[route.key];

        if (route.name === 'SearchFreights') {
          return (
            <MenuItemCenter
              key={route.key}
              onPress={() => goTo('SearchFreights')}
              style={{ elevation: 15 }}
              activeOpacity={1}
            >
              <Icon name={iconName} active={state.index === index} main />
            </MenuItemCenter>
          );
        }

        return (
          <MenuItem key={route.name} onPress={() => goTo(route.name)}>
            <MenuItemContent>
              <Icon name={iconName} active={state.index === index} />
              {options.tabBarBadge && (
                <IconBadge>
                  <IconBadgeText>{options.tabBarBadge}</IconBadgeText>
                </IconBadge>
              )}
            </MenuItemContent>
          </MenuItem>
        );
      })}
    </Container>
  );
};

export default CustomTabBar;
