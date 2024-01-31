import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../../components/Container';
import Switch from '../../../components/Controls/Switch';
import Card from '../../../components/app/Card';
import CardHeading from '../../../components/app/CardHeading';
// import settingsAction from '../../../redux/actions/settings.action';
import useTheme from '../../../hooks/useTheme';
import settingsAction from '../../../redux/actions/settings.action';

export default function ImageSetting({}) {
  const dispatch = useDispatch();
  const imageSettings = useSelector(s => s.settings.imageSettings);

  const themeData = useTheme();

  return (
    <>
      <Container style={{flex: 1}}>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CardHeading color={themeData.textColor} style={{flex: 1}}>
              Show Category Image
            </CardHeading>
            <Switch
              onChange={v => {
                dispatch(
                  settingsAction.set({
                    _prop: 'imageSettings',
                    values: {
                      showCatImage: v,
                    },
                  }),
                );
              }}
              checked={imageSettings.showCatImage}
            />
          </View>
        </Card>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CardHeading color={themeData.textColor} style={{flex: 1}}>
              Show Product Image
            </CardHeading>
            <Switch
              onChange={v => {
                dispatch(
                  settingsAction.set({
                    _prop: 'imageSettings',
                    values: {
                      showProductImage: v,
                    },
                  }),
                );
              }}
              checked={imageSettings.showProductImage}
            />
          </View>
        </Card>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CardHeading color={themeData.textColor} style={{flex: 1}}>
              Show Order Item Image
            </CardHeading>
            <Switch
              onChange={v => {
                dispatch(
                  settingsAction.set({
                    _prop: 'imageSettings',
                    values: {
                      showOrderItemImage: v,
                    },
                  }),
                );
              }}
              checked={imageSettings.showOrderItemImage}
            />
          </View>
        </Card>
      </Container>
    </>
  );
}
