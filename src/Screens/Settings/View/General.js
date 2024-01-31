import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../../components/Container';
import Switch from '../../../components/Controls/Switch';
import Card from '../../../components/app/Card';
import CardHeading from '../../../components/app/CardHeading';
// import settingsAction from '../../../redux/actions/settings.action';
import useTheme from '../../../hooks/useTheme';
import settingsAction from '../../../redux/actions/settings.action';

export default function General({}) {
  const dispatch = useDispatch();
  const generalSettings = useSelector(s => s.settings.generalSettings);

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
              Dark Mode
            </CardHeading>
            <Switch
              onChange={v => {
                dispatch(
                  settingsAction.set({
                    _prop: 'generalSettings',
                    values: {
                      darkMode: v,
                    },
                  }),
                );
              }}
              checked={generalSettings.darkMode}
            />
          </View>
        </Card>
      </Container>
    </>
  );
}
