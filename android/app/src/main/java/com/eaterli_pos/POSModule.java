package com.eaterli_pos;
import static com.eaterli_pos.gprintlib.Constant.ACTION_USB_PERMISSION;

import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.hardware.usb.UsbDevice;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintJob;
import android.print.PrintManager;
import android.text.Layout;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.eaterli_pos.gprintlib.DeviceConnFactoryManager;
import com.eaterli_pos.gprintlib.PrinterCommand;
import com.eaterli_pos.gprintlib.ThreadPool;
import com.eaterli_pos.gprintlib.UsbDeviceList;
import com.eaterli_pos.gprintlib.Utils;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.finix.sdk.FinixMobileSDK;
import com.finix.sdk.exceptions.FinixException;
import com.finix.sdk.models.EnvironmentType;
import com.gprinter.command.EscCommand;
import com.hcd.hcdpos.cashbox.Cashbox;
import com.hcd.hcdpos.printer.PrinterManager;
import com.zcs.sdk.DriverManager;
import com.zcs.sdk.HQrsanner;
import com.zcs.sdk.Printer;
import com.zcs.sdk.SdkResult;
import com.zcs.sdk.card.CardInfoEntity;
import com.zcs.sdk.card.CardReaderManager;
import com.zcs.sdk.card.CardReaderTypeEnum;
import com.zcs.sdk.card.CardSlotNoEnum;
import com.zcs.sdk.card.ICCard;
import com.zcs.sdk.listener.OnSearchCardListener;
import com.zcs.sdk.print.PrnStrFormat;
import com.zcs.sdk.print.PrnTextFont;
import com.zcs.sdk.print.PrnTextStyle;
//import com.google.zxing.client.android.CaptureActivity;
import com.zcs.sdk.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Vector;
import java.util.concurrent.ExecutorService;
//import io.realm.annotations.RealmModule;
//
//import io.realm.internal.OsObjectSchemaInfo;
//import io.realm.internal.OsSchemaInfo;
//import io.realm.annotations.RealmModule;
//import io.realm.internal.ColumnInfo;
//import io.realm.internal.OsObjectSchemaInfo;
//import io.realm.internal.OsSchemaInfo;
//import io.realm.internal.RealmObjectProxy;
//import io.realm.internal.RealmProxyMediator;
//import io.realm.
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
    private CardReaderManager mCardReadManager;
    private static final int READ_TIMEOUT = 60 * 1000;
    private ProgressDialog mProgressDialog;

    String test="NONE";
    POSModule(ReactApplicationContext context) {
        super(context);
         this.context=context;
    }


    @Override
    public String getName() {
        return "POSModule";
    }

    @ReactMethod
    public void initFinixSDK(ReadableMap data, Callback callBack) {
        Log.d(getName(), "initFinixSDK "+data.getString("env"));
        FinixMobileSDK SDK = FinixMobileSDK.client(
                data.getString("env").equals("sandbox")? EnvironmentType.SANDBOX:EnvironmentType.PRODUCTION,
                data.getString("username"),
               data.getString("password"),
                data.getString("merchantId"),
               data.getString("deviceId"),
                data.getString("deviceIdentifier"));
        WritableMap map = new WritableNativeMap();
        
       try{
           SDK.init(this.context);
           Log.d(getName(), "initFinixSDK success ");
           map.putString("success","true");
       }
       catch(FinixException finixException){
           Log.d(getName(), "initFinixSDK error "+finixException.getMessage());
           map.putString("error",finixException.getMessage());
       }


        map.putString("env",data.getString("env"));

        callBack.invoke(map);
    }

    @ReactMethod
    public void doOpenCashBox() {
        Log.d(getName(), "doOpenCashBox");
        mPrinter.openBox();
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

    @ReactMethod
    public void initSDK() {
        mDriverManager = DriverManager.getInstance();
        mPrinter = mDriverManager.getPrinter();
        mSingleThreadExecutor = mDriverManager.getSingleThreadExecutor();
        mhqscanner = mDriverManager.getHQrsannerDriver();
        mCardReadManager = mDriverManager.getCardReadManager();
    }

    @ReactMethod
    public void cutPaperPrint() {
        test="CUT CLICKED";
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
    public void printByAllInOnePOS(ReadableArray data, Callback callBack) {
        Log.d(getName(), "printByAllInOnePOS start");
     String res=printByAllInOnePOS(data);

        WritableMap map = new WritableNativeMap();
       // SimpleDateFormat formatter = new SimpleDateFormat("dd MMM, yyyy hh:mm T");
      //  String formattedDate = formatter.format(data.getString("created_at"));


        map.putString("res",res);

        callBack.invoke(map);

    }
    private String printByAllInOnePOS(ReadableArray data) {
        int printStatus = mPrinter.getPrinterStatus();
        if (printStatus == SdkResult.SDK_PRN_STATUS_PAPEROUT) {
            return "Out of paper";
            //out of paper
            // Toast.makeText(getActivity(), "Out of paper", Toast.LENGTH_SHORT).show();
        } else {


//            int order_no =   data.getInt("id");

            AssetManager asm = context.getAssets();
            InputStream inputStream = null;
            try {
                inputStream = asm.open("drawable/logo.bmp");
            } catch (IOException e) {
                e.printStackTrace();
            }
            Drawable d = Drawable.createFromStream(inputStream, null);
            Bitmap bitmap = ((BitmapDrawable) d).getBitmap();
            mPrinter.setPrintAppendBitmap(bitmap, Layout.Alignment.ALIGN_CENTER);

            PrnStrFormat format = new PrnStrFormat();
            format.setFont(PrnTextFont.SANS_SERIF);
            int l=   data.size();
            for (int i = 0; i < l; i++) {
                ReadableMap   ob = data.getMap(i);
                Layout.Alignment alignment=Layout.Alignment.ALIGN_NORMAL;
                String align=ob.getString("align");
                if(align.equals("center")){
                    alignment=Layout.Alignment.ALIGN_CENTER;
                }else  if(align.equals("right")){
                    alignment=Layout.Alignment.ALIGN_OPPOSITE;
                }
                PrnTextStyle textStyle=PrnTextStyle.NORMAL;
                String style=ob.getString("style");
                if(style.equals("bold")){
                    textStyle=PrnTextStyle.BOLD;
                }
                else  if(style.equals("italic")){
                    textStyle=PrnTextStyle.ITALIC;
                }else  if(style.equals("bold_italic")){
                    textStyle=PrnTextStyle.BOLD_ITALIC;
                }
                int size=   ob.getInt("size");
                format.setTextSize(size);
                format.setAli(alignment);
                format.setStyle(textStyle);
                mPrinter.setPrintAppendString(ob.getString("text"), format);

                Log.d(getName(), "printByAllInOnePOS Text:-> "+ob.getString("text")+" | "+alignment+" | "+textStyle+" | "+size);
            }



//            format.setTextSize(30);
//            format.setAli(Layout.Alignment.ALIGN_CENTER);
//            format.setStyle(PrnTextStyle.BOLD);
            //format.setFont(PrnTextFont.CUSTOM);
            //format.setPath(Environment.getExternalStorageDirectory() + "/fonts/simsun.ttf");
//            format.setFont(PrnTextFont.SANS_SERIF);
//            mPrinter.setPrintAppendString("FISH N FRY", format);
//            format.setTextSize(25);
//            format.setStyle(PrnTextStyle.NORMAL);
//            format.setAli(Layout.Alignment.ALIGN_NORMAL);
//            mPrinter.setPrintAppendString(" ", format);
//            mPrinter.setPrintAppendString("ORDER NO.: #" +order_no, format);
//            mPrinter.setPrintAppendString("MERCHANT NO:" + " 123456789012345 ", format);
//            mPrinter.setPrintAppendString("TERMINAL NAME:" + " 12345678 ", format);
//            mPrinter.setPrintAppendString("OPERATOR NO:" + " 01 ", format);
//            mPrinter.setPrintAppendString("CARD NO: ", format);
//            format.setAli(Layout.Alignment.ALIGN_CENTER);
//            format.setTextSize(30);
//            format.setStyle(PrnTextStyle.BOLD);
//            mPrinter.setPrintAppendString("6214 44** **** **** 7816", format);
//            format.setAli(Layout.Alignment.ALIGN_NORMAL);
//            format.setStyle(PrnTextStyle.NORMAL);
//            format.setTextSize(25);
            mPrinter.setPrintAppendString(" -----------------------------", format);
//
            mPrinter.setPrintAppendQRCode("123456789012345", 200, 200, Layout.Alignment.ALIGN_CENTER);

            mPrinter.setPrintAppendString(" ", format);
            mPrinter.setPrintAppendString(" ", format);
            mPrinter.setPrintAppendString(" ", format);
            mPrinter.setPrintAppendString(" ", format);

            printStatus = mPrinter.setPrintStart();
        }
        return "Success";
    }

    @ReactMethod
    public void scanQRCode() {
//        Intent mIntent = new Intent(context, CaptureActivity.class);
//         mIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
////          mIntent.setClass(getApplicationContext(), CaptureActivity.class);
//        context.startActivity(mIntent);


    }


    @ReactMethod
    public void readCard(ReadableMap data, Callback callBack) {
        String type=data.getString("type");
        Log.d(getName(), "readCard "+type);
        if(type.equals("ic")){
            Log.d(getName(), "call searchICCard ...");
            searchICCard(callBack);
        }


//        WritableMap map = new WritableNativeMap();
//        map.putString("type",type);
//
//        callBack.invoke(map);

    }
    private void showSearchCardDialog(String title, String msg) {
        mProgressDialog = (ProgressDialog) DialogUtils.showProgress(context,title, msg, new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                mCardReadManager.cancelSearchCard();
            }
        });
    }
    private void searchICCard(Callback callBack) {
        Log.d(getName(), " serching... ...");
//        showSearchCardDialog("Waiting...", "Please inster IC Card");
        mCardReadManager.cancelSearchCard();



         OnSearchCardListener mICCardSearchCardListener = new OnSearchCardListener() {


            @Override
            public void onCardInfo(CardInfoEntity cardInfoEntity) {
              //  mProgressDialog.dismiss();
                mCardReadManager.cancelSearchCard();
               // readICCard();
              String result=  cardInfoToString(cardInfoEntity);


                String result1=  readICCard();
//                String result="call onCardInfo";
                Log.d(getName(), "event onCardInfo");
                WritableMap map = new WritableNativeMap();
                map.putString("status","success");
                map.putString("result",result);
                map.putString("result1",result1);

                callBack.invoke(map);
            }

            @Override
            public void onError(int i) {
              //  mProgressDialog.dismiss();
               // showReadICCardErrorDialog(i);
                mCardReadManager.cancelSearchCard();
                Log.d(getName(), "event onError");
                WritableMap map = new WritableNativeMap();
                map.putInt("error",i);
                callBack.invoke(map);
            }

            @Override
            public void onNoCard(CardReaderTypeEnum cardReaderTypeEnum, boolean b) {
                Log.d(getName(), "event onNoCard");
                // mCardReadManager.cancelSearchCard();
                // WritableMap map = new WritableNativeMap();
                // map.putString("error","NO CARD");
                // map.putString("event","onNoCard");
                // map.putString("event",cardReaderTypeEnum.toString());
                // map.putBoolean("b",b);
                // callBack.invoke(map);
            }
        };

        Log.d(getName(), " searchCard");
        mCardReadManager.searchCard(CardReaderTypeEnum.IC_CARD, READ_TIMEOUT, mICCardSearchCardListener);
    }
    public static final byte[] APDU_SEND_IC = {0x00, (byte) 0xA4, 0x04, 0x00, 0x0E, 0x31, 0x50, 0x41, 0x59, 0x2E, 0x53, 0x59, 0x53, 0x2E, 0x44, 0x44, 0x46, 0x30, 0x31, 0X00};

    private  String readICCard() {
        ICCard icCard = mCardReadManager.getICCard();
        int result = icCard.icCardReset(CardSlotNoEnum.SDK_ICC_USERCARD);
        if (result == SdkResult.SDK_OK) {
            int[] recvLen = new int[1];
            byte[] recvData = new byte[300];
            result = icCard.icExchangeAPDU(CardSlotNoEnum.SDK_ICC_USERCARD, APDU_SEND_IC, recvData, recvLen);
            if (result == SdkResult.SDK_OK) {
                final String apduRecv = StringUtils.convertBytesToHex(recvData).substring(0, recvLen[0] * 2);
                icCard.icCardPowerDown(CardSlotNoEnum.SDK_ICC_USERCARD);

                return apduRecv;

//                CardFragment.this.getActivity().runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        DialogUtils.show(getActivity(), "Read IC card result", apduRecv);
//                    }
//                });
            } else {
                icCard.icCardPowerDown(CardSlotNoEnum.SDK_ICC_USERCARD);

                return result+"";


                // showReadICCardErrorDialog(result);
            }
        } else {
            icCard.icCardPowerDown(CardSlotNoEnum.SDK_ICC_USERCARD);

            return result+"";


            // showReadICCardErrorDialog(result);
        }

        //return "";
    }

    private static String cardInfoToString(CardInfoEntity cardInfoEntity) {
        if (cardInfoEntity == null)
            return "";
        StringBuilder sb = new StringBuilder();
        try {

            sb.append("Resultcode:\t" + cardInfoEntity.getResultcode() + "\n")
                    .append(cardInfoEntity.getCardExistslot() == null ? "" : "Card type:\t" + cardInfoEntity.getCardExistslot().name() + "\n")
                    .append(cardInfoEntity.getCardNo() == null ? "" : "Card no:\t" + cardInfoEntity.getCardNo() + "\n")
                    .append(cardInfoEntity.getRfCardType() == 0 ? "" : "Rf card type:\t" + cardInfoEntity.getRfCardType() + "\n")
                    .append(cardInfoEntity.getRFuid() == null ? "" : "RFUid:\t" + new String(cardInfoEntity.getRFuid()) + "\n")
                    .append(cardInfoEntity.getAtr() == null ? "" : "Atr:\t" + cardInfoEntity.getAtr() + "\n")
                    .append(cardInfoEntity.getTk1() == null ? "" : "Track1:\t" + cardInfoEntity.getTk1() + "\n")
                    .append(cardInfoEntity.getTk2() == null ? "" : "Track2:\t" + cardInfoEntity.getTk2() + "\n")
                    .append(cardInfoEntity.getTk3() == null ? "" : "Track3:\t" + cardInfoEntity.getTk3() + "\n")
                    .append(cardInfoEntity.getExpiredDate() == null ? "" : "expiredDate:\t" + cardInfoEntity.getExpiredDate() + "\n")
                    .append(cardInfoEntity.getServiceCode() == null ? "" : "serviceCode:\t" + cardInfoEntity.getServiceCode());
        }catch (Exception e){
            sb.append("ERROR:\t"+e.getMessage() +"\n"+e.toString());
        }
         return sb.toString();
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
    private WebView mWebView;
    @ReactMethod
    public void printByNativeCode(ReadableMap data, Callback callBack) {
        Log.d(getName(), "printByNativeCode "+data.getString(("name")));
        // Create a WebView object specifically for printing
        WebView webView = new WebView(this.getCurrentActivity());
        webView.setWebViewClient(new WebViewClient() {

            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                Log.i(TAG, "page finished loading " + url);
                createWebPrintJob(view);
                mWebView = null;
            }
        });

        // Generate an HTML document on the fly:
        String htmlDocument = "<html><body><h1>Test Content</h1><p>Testing, " +
                "testing, testing...</p></body></html>";
        webView.loadDataWithBaseURL(null, htmlDocument, "text/HTML", "UTF-8", null);

        // Keep a reference to WebView object until you pass the PrintDocumentAdapter
        // to the PrintManager
        mWebView = webView;
        WritableMap map = new WritableNativeMap();



        callBack.invoke(map);

    }

    private void createWebPrintJob(WebView webView) {

        // Get a PrintManager instance
        PrintManager printManager = (PrintManager) this.getCurrentActivity()
                .getSystemService(Context.PRINT_SERVICE);

        String jobName = "Eaterli POS Document";

        // Get a print adapter instance
        PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter(jobName);


        PrintAttributes printAttributes=    new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build();

        // Create a print job with name and adapter instance
        PrintJob printJob = printManager.print(jobName,printAdapter, printAttributes);

        // Save the job object for later status checking
//        printJobs.add(printJob);
    }


    @ReactMethod
    public void getUSBGPrinters(ReadableMap data, Callback callBack) {
        Log.d(getName(), "getUSBGPrinters start");


        WritableArray devices=new UsbDeviceList().getUsbDeviceList(this.context);


        WritableMap map = new WritableNativeMap();
        map.putArray("devices",devices);
        map.putString("testVar",test);
        callBack.invoke(map);

    }
    private String			usbName;
    private int		id = 0;
    private void closeport()
    {
        if ( DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id] != null &&DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id].mPort != null )
        {
            DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id].reader.cancel();
            DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id].mPort.closePort();
            DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id].mPort = null;
        }
    }


    /**
     * usb连接
     *
     * @param usbDevice
     */
    private void usbConn( UsbDevice usbDevice )
    {
        new DeviceConnFactoryManager.Build()
                .setId( id )
                .setConnMethod( DeviceConnFactoryManager.CONN_METHOD.USB )
                .setUsbDevice( usbDevice )
                .setContext( this.context )
                .build();
        DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id].openPort();
    }


    @ReactMethod
    public void getConnectUSBGPrinter(ReadableMap data, Callback callBack) {
        Log.d(getName(), "getUSBGPrinters start");
        WritableMap map = new WritableNativeMap();
        String pname=data.getString("pname");

        usbName = pname;
        try {
            closeport();
            /* 通过USB设备名找到USB设备 */
            UsbDevice usbDevice = Utils.getUsbDeviceFromName(this.context, usbName);
            /* 判断USB设备是否有权限 */
            if (MainActivity.usbManager.hasPermission(usbDevice)) {
                usbConn(usbDevice);
            } else {        /* 请求权限 */
                MainActivity.mPermissionIntent = PendingIntent.getBroadcast(this.context, 0, new Intent(ACTION_USB_PERMISSION), 0);
                MainActivity.usbManager.requestPermission(usbDevice, MainActivity.mPermissionIntent);
            }

        } catch(Exception exception){
            Log.d(getName(), "[getConnectUSBGPrinter] error "+exception.getMessage());
            map.putString("error",exception.getMessage());
        }


        map.putString("pname",pname);
        callBack.invoke(map);

    }

    private ThreadPool		threadPool;
    @ReactMethod
    public void printUSBGPrinter(ReadableArray data, Callback callBack) {
        Log.d(getName(), "getUSBGPrinters start");
        WritableMap map = new WritableNativeMap();

        try {
        if ( DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id] == null ||
                !DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id].getConnState() )
        {
            Utils.toast( this.context,this.context.getString( R.string.str_cann_printer ) );
            return;
        }
        Context _context=this.context;
        threadPool = ThreadPool.getInstantiation();

        threadPool.addTask( new Runnable()
        {
            @Override
            public void run()
            {
                if ( DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id].getCurrentPrinterCommand() == PrinterCommand.ESC )
                {
                    sendReceiptWithResponse(data);
                } else {
                    Utils.toast(  _context,_context.getString( R.string.str_choice_printer_command ) );

                }
            }
        } );

        } catch(Exception exception){
            Log.d(getName(), "[printUSBGPrinter] error "+exception.getMessage());
            map.putString("error",exception.getMessage());
        }

        callBack.invoke(map);

    }


    void sendReceiptWithResponse(ReadableArray data)
    {
        EscCommand esc = new EscCommand();
        esc.addInitializePrinter();
        esc.addPrintAndFeedLines( (byte) 3 );
        Bitmap b = BitmapFactory.decodeResource( this.context.getResources(),
                R.drawable.logo );

    //    esc.addSetAbsolutePrintPosition((short)90);
        esc.addRastBitImage( b, 570, 0 );

                esc.addPrintAndLineFeed();
    //    esc.addSetAbsolutePrintPosition((short)0);
        int l=   data.size();
        for (int i = 0; i < l; i++) {
            ReadableMap   ob = data.getMap(i);
            EscCommand.JUSTIFICATION alignment= EscCommand.JUSTIFICATION.LEFT;



            String align=ob.getString("align");
            String style=ob.getString("style");
            int charSize=   ob.getInt("charSize");
            int size=   ob.getInt("size");
            String text=ob.getString("text");
            if(align.equals("center")){
                alignment=EscCommand.JUSTIFICATION.CENTER;
            }else  if(align.equals("right")){
                alignment=EscCommand.JUSTIFICATION.RIGHT;
            }

            EscCommand.ENABLE isBold=    EscCommand.ENABLE.OFF;
            if(style.equals("bold")){
                isBold=EscCommand.ENABLE.ON;
            }


            EscCommand.WIDTH_ZOOM cW =    EscCommand.WIDTH_ZOOM.MUL_1;
            EscCommand.HEIGHT_ZOOM cH =    EscCommand.HEIGHT_ZOOM.MUL_1;

            switch (charSize){
                case 2:
                    cW =    EscCommand.WIDTH_ZOOM.MUL_2;
                    cH =    EscCommand.HEIGHT_ZOOM.MUL_2;
                   break;
                case 3:
                    cW =    EscCommand.WIDTH_ZOOM.MUL_3;
                    cH =    EscCommand.HEIGHT_ZOOM.MUL_3;
                    break;
                case 4:
                    cW =    EscCommand.WIDTH_ZOOM.MUL_4;
                    cH =    EscCommand.HEIGHT_ZOOM.MUL_4;
                    break;
                case 5:
                    cW =    EscCommand.WIDTH_ZOOM.MUL_5;
                    cH =    EscCommand.HEIGHT_ZOOM.MUL_5;
                    break;
                case 6:
                    cW =    EscCommand.WIDTH_ZOOM.MUL_6;
                    cH =    EscCommand.HEIGHT_ZOOM.MUL_6;
                   break;
                case 7:
                    cW =    EscCommand.WIDTH_ZOOM.MUL_7;
                    cH =    EscCommand.HEIGHT_ZOOM.MUL_7;
                    break;
                case 8:
                    cW =    EscCommand.WIDTH_ZOOM.MUL_8;
                    cH =    EscCommand.HEIGHT_ZOOM.MUL_8;
                    break;
            }


            
           
            esc.addSelectPrintModes( EscCommand.FONT.FONTA, isBold, EscCommand.ENABLE.ON, EscCommand.ENABLE.ON, EscCommand.ENABLE.OFF );
            esc.addSetCharcterSize(cW,cH);
            esc.addSelectJustification( alignment);
            esc.addText( text+"\n" );

//            format.setTextSize(size);
//            format.setAli(alignment);
//            format.setStyle(textStyle);
//
//
//            mPrinter.setPrintAppendString(ob.getString("text"), format);

           // Log.d(getName(), "printByAllInOnePOS Text:-> "+ob.getString("text")+" | "+alignment+" | "+textStyle+" | "+size);
        }

        esc.addPrintAndFeedLines( (byte) 3 );


//        /* 设置打印居中 */
//        esc.addSelectJustification( EscCommand.JUSTIFICATION.CENTER );
//        /* 设置为倍高倍宽 */
//        esc.addSelectPrintModes( EscCommand.FONT.FONTA, EscCommand.ENABLE.OFF, EscCommand.ENABLE.ON, EscCommand.ENABLE.ON, EscCommand.ENABLE.OFF );
//        /* 打印文字 */
//        esc.addText( "Sample\n" );
//        esc.addPrintAndLineFeed();
//
//        /* 打印文字 */
//        /* 取消倍高倍宽 */
//        esc.addSelectPrintModes( EscCommand.FONT.FONTA, EscCommand.ENABLE.OFF, EscCommand.ENABLE.OFF, EscCommand.ENABLE.OFF, EscCommand.ENABLE.OFF );
//        /* 设置打印左对齐 */
//        esc.addSelectJustification( EscCommand.JUSTIFICATION.LEFT );
//        /* 打印文字 */
//        esc.addText( "Print text\n" );
//        /* 打印文字 */
//        esc.addText( "Welcome to use SMARNET printer!\n" );
//
//        /* 打印繁体中文 需要打印机支持繁体字库 */
//        String message = "佳博智匯票據打印機\n";
//        esc.addText( message, "GB2312" );
//        esc.addPrintAndLineFeed();
//
//        /* 绝对位置 具体详细信息请查看GP58编程手册 */
//        esc.addText( "智汇" );
//        esc.addSetHorAndVerMotionUnits( (byte) 7, (byte) 0 );
//        esc.addSetAbsolutePrintPosition( (short) 6 );
//        esc.addText( "网络" );
//        esc.addSetAbsolutePrintPosition( (short) 10 );
//        esc.addText( "设备" );
//        esc.addPrintAndLineFeed();
//
//        /* 打印图片 */
//        /* 打印文字 */
//        esc.addText( "Print bitmap!\n" );
//        Bitmap b = BitmapFactory.decodeResource( this.context.getResources(),
//                R.drawable.gprinter );
//        /* 打印图片 */
//        esc.addRastBitImage( b, 380, 0 );
//
//        /* 打印一维条码 */
//        /* 打印文字 */
//        esc.addText( "Print code128\n" );
//        esc.addSelectPrintingPositionForHRICharacters( EscCommand.HRI_POSITION.BELOW );
//        /*
//         * 设置条码可识别字符位置在条码下方
//         * 设置条码高度为60点
//         */
//        esc.addSetBarcodeHeight( (byte) 60 );
//        /* 设置条码单元宽度为1 */
//        esc.addSetBarcodeWidth( (byte) 1 );
//        /* 打印Code128码 */
//        esc.addCODE128( esc.genCodeB( "SMARNET" ) );
//        esc.addPrintAndLineFeed();
//
//
//        /*
//         * QRCode命令打印 此命令只在支持QRCode命令打印的机型才能使用。 在不支持二维码指令打印的机型上，则需要发送二维条码图片
//         */
//        /* 打印文字 */
//        esc.addText( "Print QRcode\n" );
//        /* 设置纠错等级 */
//        esc.addSelectErrorCorrectionLevelForQRCode( (byte) 0x31 );
//        /* 设置qrcode模块大小 */
//        esc.addSelectSizeOfModuleForQRCode( (byte) 3 );
//        /* 设置qrcode内容 */
//        esc.addStoreQRCodeData( "www.smarnet.cc" );
//        esc.addPrintQRCode(); /* 打印QRCode */
//        esc.addPrintAndLineFeed();
//
//        /* 设置打印左对齐 */
//        esc.addSelectJustification( EscCommand.JUSTIFICATION.CENTER );
//        /* 打印文字 */
//        esc.addText( "Completed!\r\n" );
//
//        /* 开钱箱 */
//        esc.addGeneratePlus( LabelCommand.FOOT.F5, (byte) 255, (byte) 255 );
//        esc.addPrintAndFeedLines( (byte) 8 );
        /* 加入查询打印机状态，用于连续打印 */
        byte[] bytes = { 29, 114, 1 };
        esc.addUserCommand( bytes );
        Vector<Byte> datas = esc.getCommand();
        /* 发送数据 */
        DeviceConnFactoryManager.getDeviceConnFactoryManagers()[id].sendDataImmediately( datas );
    }

}

