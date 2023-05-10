package com.eaterli_pos;
import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.hcd.hcdpos.cashbox.Cashbox;
import com.hcd.hcdpos.printer.PrinterManager;

import org.json.JSONException;

import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;

public class POSModule extends ReactContextBaseJavaModule {
     Context context;
    POSModule(ReactApplicationContext context) {
        super(context);
         this.context=context;
    }


    @Override
    public String getName() {
        return "POSModule";
    }

    @ReactMethod
    public void doOpenCashBox() {
        Log.d(getName(), "doOpenCashBox");
        Cashbox.doOpenCashBox();

    }

//     @ReactMethod(isBlockingSynchronousMethod = true)
   @ReactMethod
     public void testPrint(ReadableMap data, Callback callBack) {
         Log.d(getName(), "testPrint "+data.getString(("name")));
         PrinterManager printerManager=new PrinterManager(this.context);
       boolean attach=  printerManager.attach();
       boolean ensurePrinterManagerAttached= printerManager.ensurePrinterManagerAttached();
        int printerStatus=  printerManager.getPrinterStatus();
        String text ="Eaterli POS Test Print\n---------------";
       byte[] b = text.getBytes();
//       byte[] b = text.getBytes(Charset.forName("UTF-8"));

         printerManager.doPrint(b);
         WritableMap map = new WritableNativeMap();
       map.putBoolean("attach",attach);
         map.putBoolean("ensurePrinterManagerAttached",ensurePrinterManagerAttached);
         map.putInt("printerStatus",printerStatus);
         callBack.invoke(map);

     }
}

