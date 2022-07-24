package com.appspotx;

import android.content.ComponentName;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SpotXNativeModules extends ReactContextBaseJavaModule {
  public SpotXNativeModules(ReactApplicationContext reactApplicationContext) {
    super(reactApplicationContext);
  }

  @NonNull
  @Override
  public String getName() {
    return "RNSettingsDeveloperModules";
  }

  @ReactMethod
  public void IsDeveloperSettingsEnabled(Promise promise) {
    ContentResolver resolver =  getReactApplicationContext().getContentResolver();
    if(!BuildConfig.DEBUG) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.CUPCAKE) {
        if (Settings.Secure.getInt(resolver,
          Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0) != 0) {
          promise.resolve(true);
        } else {
          promise.resolve(false);
        }
      }
    }
  }

  @ReactMethod
  public void getSettingsDeveloperOptions() {
    if(!BuildConfig.DEBUG) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.CUPCAKE) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
        getCurrentActivity().startActivity(new Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS));
        Toast toast = Toast.makeText(getReactApplicationContext(),"Desative as Opções do Desenvolvedor.",Toast.LENGTH_LONG);
        toast.show();
      }
    }
   }
  }
}
