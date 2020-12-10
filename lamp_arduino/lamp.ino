//引入ESP8266.h头文件，建议使用教程中修改后的文件
#include "ESP8266.h"
#include "SoftwareSerial.h"

//配置ESP8266WIFI设置
#define SSID "zbc"    //填写2.4GHz的WIFI名称，不要使用校园网
#define PASSWORD "87654321"//填写自己的WIFI密码
#define HOST_NAME "api.heclouds.com"  //API主机名称，连接到OneNET平台，无需修改
#define DEVICE_ID "651686662"       //填写自己的OneNet设备ID
#define HOST_PORT (80)                //API端口，连接到OneNET平台，无需修改
String APIKey = "Y9TcBWiQACL1Dnn=F0WGEdsDsKc="; //与设备绑定的APIKey

#define INTERVAL_SENSOR 500 //定义传感器采样及发送时间间隔

int Sensor=9;
int LED=7;
int val = digitalRead(Sensor);

//定义ESP8266所连接的软串口
/*********************
 * 该实验需要使用软串口
 * Arduino上的软串口RX定义为D3,
 * 接ESP8266上的TX口,
 * Arduino上的软串口TX定义为D2,
 * 接ESP8266上的RX口.
 * D3和D2可以自定义,
 * 但接ESP8266时必须恰好相反
 *********************/
SoftwareSerial mySerial(3, 2);
ESP8266 wifi(mySerial);

void setup() {
   mySerial.begin(115200); //初始化软串口
  Serial.begin(9600);     //初始化串口
   pinMode(LED,OUTPUT);
 pinMode(Sensor, INPUT);
  Serial.print("setup begin\r\n");

  //以下为ESP8266初始化的代码
  Serial.print("FW Version: ");
  Serial.println(wifi.getVersion().c_str());

  if (wifi.setOprToStation()) {
    Serial.print("to station ok\r\n");
  } else {
    Serial.print("to station err\r\n");
  }

  //ESP8266接入WIFI
  if (wifi.joinAP(SSID, PASSWORD)) {
    Serial.print("Join AP success\r\n");
    Serial.print("IP: ");
    Serial.println(wifi.getLocalIP().c_str());
  } else {
    Serial.print("Join AP failure\r\n");
  }

  Serial.println("");

  mySerial.println("AT+UART_CUR=9600,8,1,0,0");
  mySerial.begin(9600);
  Serial.println("setup end\r\n");

}
unsigned long net_time1 = millis();

void loop() {
 
   if (net_time1 > millis())
    net_time1 = millis();
 if(val==1){
    Serial.println("peopel here");
    digitalWrite(7,HIGH);}
    else{Serial.println("nobady here");
    digitalWrite(7,LOW);
    }
    delay(2000);
  if (millis() - net_time1 > INTERVAL_SENSOR) //发送数据时间间隔
  {
    Serial.print("Read sensor: ");
    Serial.println(val);
if (wifi.createTCP(HOST_NAME, HOST_PORT)) { //建立TCP连接，如果失败，不能发送该数据
Serial.print("create tcp ok\r\n"); 
delay(2000);
    char buf[10];
      //拼接发送data字段字符串
      String jsonToSend = "{\"anybodyHere\":";
      dtostrf(val, 1, 2, buf);
      jsonToSend += "\"" + String(buf) + "\"";
      jsonToSend += "}";
 

      //拼接POST请求字符串
      String postString = "POST /devices/";
      postString += DEVICE_ID;
      postString += "/datapoints?type=3 HTTP/1.1";
      postString += "\r\n";
      postString += "api-key:";
      postString += APIKey;
      postString += "\r\n";
      postString += "Host:api.heclouds.com\r\n";
      postString += "Connection:close\r\n";
      postString += "Content-Length:";
      postString += jsonToSend.length();
      postString += "\r\n";
      postString += "\r\n";
      postString += jsonToSend;
      postString += "\r\n";
      postString += "\r\n";
      postString += "\r\n";
    const char *postArray = postString.c_str(); //将str转化为char数组
     
     Serial.println(postArray);
      wifi.send((const uint8_t *)postArray, strlen(postArray)); 
      Serial.println("send success");
      if (wifi.releaseTCP()) { //释放TCP连接
        Serial.print("release tcp ok\r\n");
      } else {
        Serial.print("release tcp err\r\n");
      }
      postArray = NULL;
}else {
      Serial.print("create tcp err\r\n");
    }

    Serial.println("");
    net_time1 = millis();
  }
}
