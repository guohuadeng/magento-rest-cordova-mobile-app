/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.skymazon.android;

import android.os.Bundle;
import org.apache.cordova.*;

import android.os.Handler;
import android.os.HandlerThread;
import android.view.KeyEvent;
import android.widget.Toast;

public class MainActivity extends CordovaActivity
{
    private Exit exit = new Exit();
    
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }

    /**
     * 退出程序
     */
    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (false && event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
            if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
                pressAgainExit();
            }
            return true;
        }
        return super.dispatchKeyEvent(event);
    }

    /**
     * 再按一次退出程序。
     */
    private void pressAgainExit() {
        if (exit.isExit()) {
            finish();
        } else {
            Toast.makeText(this, R.string.double_exit, Toast.LENGTH_SHORT).show();
            exit.doExitInOneSecond();
        }
    }

    class Exit {
        private boolean isExit = false;
        private Runnable task = new Runnable() {
            @Override
            public void run() {
                isExit = false;
            }
        };

        public void doExitInOneSecond() {
            isExit = true;
            HandlerThread thread = new HandlerThread("doTask");
            thread.start();
            new Handler(thread.getLooper()).postDelayed(task, 1000);
        }

        public boolean isExit() {
            return isExit;
        }

        public void setExit(boolean isExit) {
            this.isExit = isExit;
        }
    }
}
