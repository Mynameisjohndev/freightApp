package com.appspotx;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import android.app.AlertDialog;
import android.content.ContentResolver;
import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;

import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {
  public boolean isOnNewIntent = false;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "appspotx";
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    isOnNewIntent = true;
    ForegroundEmitter();
  }

  @Override
  protected void onStart() {
    super.onStart();
    if(isOnNewIntent == true){}else {
        ForegroundEmitter();
    }
  }

  public  void  ForegroundEmitter(){
    // this method is to send back data from java to javascript so one can easily
    // know which button from notification or the notification button is clicked
    String  main = getIntent().getStringExtra("mainOnPress");
    String  btn = getIntent().getStringExtra("buttonOnPress");
    WritableMap  map = Arguments.createMap();
    if (main != null) {
        map.putString("main", main);
    }
    if (btn != null) {
        map.putString("button", btn);
    }
    try {
        getReactInstanceManager().getCurrentReactContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("notificationClickHandle", map);
    } catch (Exception  e) {
        Log.e("SuperLog", "Caught Exception: " + e.getMessage());
    }
  }
}
