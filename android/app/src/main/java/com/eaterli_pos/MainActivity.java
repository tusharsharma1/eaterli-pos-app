package com.eaterli_pos;

import com.eaterli_pos.gprintlib.DeviceConnFactoryManager;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import static android.hardware.usb.UsbManager.ACTION_USB_DEVICE_ATTACHED;
import static android.hardware.usb.UsbManager.ACTION_USB_DEVICE_DETACHED;

import static com.eaterli_pos.gprintlib.Constant.ACTION_USB_PERMISSION;
import static com.eaterli_pos.gprintlib.DeviceConnFactoryManager.ACTION_QUERY_PRINTER_STATE;

import android.app.PendingIntent;
import android.content.Context;
import android.content.IntentFilter;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
public class MainActivity extends ReactActivity {
  public static UsbManager		usbManager;
  public static PendingIntent mPermissionIntent;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
    MainActivity.usbManager = (UsbManager) getSystemService( Context.USB_SERVICE );
  }
  @Override
  protected void onStart()
  {
    super.onStart();
    IntentFilter filter = new IntentFilter( ACTION_USB_PERMISSION );
    filter.addAction( ACTION_USB_DEVICE_DETACHED );
    filter.addAction( ACTION_QUERY_PRINTER_STATE );
    filter.addAction( DeviceConnFactoryManager.ACTION_CONN_STATE );
    filter.addAction( ACTION_USB_DEVICE_ATTACHED );
//    registerReceiver( receiver, filter );
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "eaterli_pos";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
