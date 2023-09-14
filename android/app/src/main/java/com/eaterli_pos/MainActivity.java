package com.eaterli_pos;

import static android.hardware.usb.UsbManager.ACTION_USB_DEVICE_ATTACHED;
import static android.hardware.usb.UsbManager.ACTION_USB_DEVICE_DETACHED;

import static com.eaterli_pos.gprintlib.Constant.ACTION_USB_PERMISSION;
import static com.eaterli_pos.gprintlib.DeviceConnFactoryManager.ACTION_QUERY_PRINTER_STATE;

import com.eaterli_pos.gprintlib.DeviceConnFactoryManager;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

import android.app.PendingIntent;
import android.content.Context;
import android.content.IntentFilter;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
//import android.os.PersistableBundle;

//import androidx.annotation.Nullable;

//import com.hcd.hcdpos.cashbox.Cashbox;


//import com.gprinter.io.BluetoothPort;
//import com.gprinter.io.EthernetPort;
//import com.gprinter.io.PortManager;
//import com.gprinter.io.SerialPort;
//import com.gprinter.io.UsbPort;
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

//  @Override
//  public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
//    super.onCreate(savedInstanceState, persistentState);
//    Cashbox.doOpenCashBox();
//  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "eaterli_pos";
  }





  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
