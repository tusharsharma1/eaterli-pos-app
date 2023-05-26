package com.eaterli_pos;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Environment;
import android.text.Layout;
import android.util.Log;
import android.widget.Toast;

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
import com.google.zxing.BarcodeFormat;
import com.zcs.sdk.DriverManager;
import com.zcs.sdk.HQrsanner;
import com.zcs.sdk.Printer;
import com.zcs.sdk.SdkResult;
import com.zcs.sdk.print.PrnStrFormat;
import com.zcs.sdk.print.PrnTextFont;
import com.zcs.sdk.print.PrnTextStyle;
import org.json.JSONException;
import com.google.zxing.client.android.CaptureActivity;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.ExecutorService;

public class POSModule extends ReactContextBaseJavaModule {
     Context context;
    private static final String KEY_PRINT_TEXT = "print_text_key";
    private static final String KEY_PRINT_QRCODE = "print_qrcode_key";
    private static final String KEY_PRINT_BARCODE = "print_barcode_key";
    private static final String KEY_PRINT_BITMAP = "print_bitmap_key";

    private static final String KEY_PRINT_LABEL = "print_lable_key";

    private static final String KEY_PRINT_WITH_SERVICE = "print_with_android_service_key";
    private static final String KEY_CONNECT_BLUETOOTH = "connect_bluetooth";
    private static final String KEY_PRINT_TEXT_WITH_BLUETOOTH = "print_text_with_bluetooth_key";
    private static final String TAG = "PrintFragment";

    private DriverManager mDriverManager;
    private Printer mPrinter;
    private HQrsanner mhqscanner;
    private ExecutorService mSingleThreadExecutor;

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
        mPrinter.openBox();
//        Cashbox.doOpenCashBox();

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

    @ReactMethod
    public void initSDK() {
        mDriverManager = DriverManager.getInstance();
        mPrinter = mDriverManager.getPrinter();
        mSingleThreadExecutor = mDriverManager.getSingleThreadExecutor();
        mhqscanner = mDriverManager.getHQrsannerDriver();
    }

    @ReactMethod
    public void cutPaperPrint() {
        cutPaper();
    }
    @ReactMethod
    public void scanHQRCode(ReadableMap data, Callback callBack) {
        Log.d(getName(), "scanHQRCode "+data.getString(("name")));

        mhqscanner.QRScanerPowerCtrl((byte) 1);
        Log.d(getName(), "scanHQRCode QRScanerPowerCtrl 1");
        mhqscanner.QRScanerCtrl((byte)1);
        Log.d(getName(), "scanHQRCode QRScanerCtrl 1");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mhqscanner.QRScanerCtrl((byte)0);
        Log.d(getName(), "scanHQRCode QRScanerCtrl 0");

        WritableMap map = new WritableNativeMap();
//        map.putString("res",res);

        callBack.invoke(map);

    }

    @ReactMethod
    public void textPrint(ReadableMap data, Callback callBack) {
        Log.d(getName(), "testPrint "+data.getString(("name")));
     String res=printText();

        WritableMap map = new WritableNativeMap();
        map.putString("res",res);

        callBack.invoke(map);

    }
    @ReactMethod
    public void scanQRCode() {
        Intent mIntent = new Intent(context, CaptureActivity.class);
         mIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//          mIntent.setClass(getApplicationContext(), CaptureActivity.class);
        context.startActivity(mIntent);


    }


    private String printText() {
        int printStatus = mPrinter.getPrinterStatus();
        if (printStatus == SdkResult.SDK_PRN_STATUS_PAPEROUT) {
            return "Out of paper";
            //out of paper
           // Toast.makeText(getActivity(), "Out of paper", Toast.LENGTH_SHORT).show();
        } else {
            AssetManager asm = context.getAssets();
            InputStream inputStream = null;
            try {
                inputStream = asm.open("logo.bmp");
            } catch (IOException e) {
                e.printStackTrace();
            }
            Drawable d = Drawable.createFromStream(inputStream, null);
            Bitmap bitmap = ((BitmapDrawable) d).getBitmap();
            mPrinter.setPrintAppendBitmap(bitmap, Layout.Alignment.ALIGN_CENTER);

            PrnStrFormat format = new PrnStrFormat();
            format.setTextSize(30);
            format.setAli(Layout.Alignment.ALIGN_CENTER);
            format.setStyle(PrnTextStyle.BOLD);
            //format.setFont(PrnTextFont.CUSTOM);
            //format.setPath(Environment.getExternalStorageDirectory() + "/fonts/simsun.ttf");
            format.setFont(PrnTextFont.SANS_SERIF);
            mPrinter.setPrintAppendString("POS SALES SLIP", format);
            format.setTextSize(25);
            format.setStyle(PrnTextStyle.NORMAL);
            format.setAli(Layout.Alignment.ALIGN_NORMAL);
            mPrinter.setPrintAppendString(" ", format);
            mPrinter.setPrintAppendString("MERCHANGT NAME:" + " Test ", format);
            mPrinter.setPrintAppendString("MERCHANT NO:" + " 123456789012345 ", format);
            mPrinter.setPrintAppendString("TERMINAL NAME:" + " 12345678 ", format);
            mPrinter.setPrintAppendString("OPERATOR NO:" + " 01 ", format);
            mPrinter.setPrintAppendString("CARD NO: ", format);
            format.setAli(Layout.Alignment.ALIGN_CENTER);
            format.setTextSize(30);
            format.setStyle(PrnTextStyle.BOLD);
            mPrinter.setPrintAppendString("6214 44** **** **** 7816", format);
            format.setAli(Layout.Alignment.ALIGN_NORMAL);
            format.setStyle(PrnTextStyle.NORMAL);
            format.setTextSize(25);
            mPrinter.setPrintAppendString(" -----------------------------", format);

            mPrinter.setPrintAppendQRCode("AAKASH-123456789012345", 200, 200, Layout.Alignment.ALIGN_CENTER);

            mPrinter.setPrintAppendString(" ", format);
            mPrinter.setPrintAppendString(" ", format);
            mPrinter.setPrintAppendString(" ", format);
            mPrinter.setPrintAppendString(" ", format);

            printStatus = mPrinter.setPrintStart();
        }
        return "Success";
    }

    private void cutPaper() {
        mSingleThreadExecutor.execute(new Runnable() {
            @Override
            public void run() {
                int printStatus = mPrinter.getPrinterStatus();
                if(printStatus == SdkResult.SDK_OK) {
                    mPrinter.openPrnCutter((byte) 1);
                }
                Log.d(getName(), "cutPaper ");
            }
        });
    }
}

