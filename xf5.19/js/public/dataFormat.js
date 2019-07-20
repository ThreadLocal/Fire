/**
 * Created by Administrator on 2017/3/31.
 */
/*campusMapҳ��*/
/*¥��״̬ ¥��������������  WebSocket*/
getData = {
        "A��": {
            "buildingStatus": {  //ֻ�����쳣��¥��״̬
                "1010": "1",  //"1"��ʾ���� "2"��ʾ�쳣
                "1011": "2"
            },
            "buildingNum": "",               //��У���¥������
            "monitorNumTotal": "200",     //��У������¥���ļ��ڵ�����
            "abnormalNumTotal": "10",     //��У������¥�����쳣�ڵ�����
            "alarmNumTotal": "2",          //��У������¥���ı����ڵ�����
            "buildingDetailInfo":{
            	"1010":{
                    "total":{
                        "monitorNumTotal": "200",     //¥���ļ��ڵ�����
                        "abnormalNumTotal": "10",    //¥�����쳣�ڵ�����
                        "alarmNumTotal": "2"       //¥���ı����ڵ�����
                        /*"normalRateTotal": "75%"  //¥����������*/
                    },
                    "system":{
                        /*"���ˮѹ":["100","75%","3","2"],  //[0]�Ǽ��ڵ����  [1]������  [2] �쳣�ڵ����  [3]�Ǳ����ڵ����
                         "���ˮ��":["60","80%","5","1"],
                         "����":["80","80%","2","6"]*/
                        "���ˮѹ":["100","3","2"],  //[0]�Ǽ��ڵ����  [1] �쳣�ڵ����  [2]�Ǳ����ڵ����
                        "���ˮ��":["60","5","1"],
                        "����":["80","2","6"]
                    }
                },
                "1011":{}
            }
        },
        "B��": {},
        "C��": {}
};
/*¥��λ��  Ajax*/
sendData = "buildingLocation";
/*getData = {  //����У������¥����λ�ú����
    "A": {
        "1010": ["����ѧ¥", "192px", "865px"],  //[0]��¥�����  [1]��top  [2]��left
        "1011": ["�����ѧ¥", "560px", "588px"]
    },
    "B": {
        "2010":["����","300px", "500px"]
    },
    "C": {
        "3010":["��ѧ¥","250px", "600px"]
    }
};*/
getData = {  //����У������¥����λ�ú����
    "A��": [
        {
            "buildingID": "1010",
            "buildingName": "A������",
            "buildingLocation": "A��",
            "svgx": "10",   //left
            "svgy": "20"    //top
        },
        {
            "buildingID": "1011",
            "buildingName": "A��˽�",
            "buildingLocation": "A��",
            "svgx": "123",
            "svgy": "123"
        }
    ]
};

/*abnormalManagementҳ��*/
/*ɸѡ���������  json�ļ�*/
/*abnormaOption.js*/

/*�쳣���ɸѡ������  Ajax*/
/**
 ϵͳ		"id":1(ˮϵͳ--1������--2)
 �쳣����	"faultCategory":"Ԥ��"(���ϣ�Ԥ������)
 У��		"fire_unit.unitID":10(A��--10��B��--20��C��--30)
 ¥��		"buildingID":1010
 �쳣״̬	"mvfaultDealState":"������"(δ���ã������У��Ѵ���)
 "timeName":"faultTime"
 ��ʼʱ��	"timeStart":"2015-5-5 16:15:15.00"(��ʱ��֮����쳣)
 ����ʱ��	"timeEnd":"2015-5-5 16:15:15.00"(��ʱ��֮ǰ���쳣)�豸����
 "stdDeviceType":"ʲôʲô�豸"��Ŀǰ��ʹ�ã�
 ģ���ѯ    "fuzzyPara":""��������ַ�
**/
sendData = {"controller":"FaultQuery","enum":"faultScreen","jsonPara":{"lengthPerPage":"20","page":1,"id":1}};
/*�յ����쳣���  Ajax*/
getData = {
  "tableItem":{
      "tableHeader":[
          "�ڵ���","ϵͳ���","�쳣����","�ڵ�����","�ڵ�λ��","�ڵ�����","�쳣ʱ��","�쳣״̬","����ʱ��","������Ա","���ʱ��","���÷���"
          //fault_current.nodeID �ڵ���
          //fire_subsystem.name, ϵͳ���
          //fault_current.faultCategory, �쳣����
          //fire_unit.unitName, У�����
          //fire_building.buildingName, ¥�����
          //fault_current.faultLocation, �ڵ�λ��
          //stdDeviceType, �ڵ�����
          //fault_current.faultTime AS time, �쳣ʱ��
          //fault_current.mvfaultDealState, �쳣״̬
          //fault_current.mnDeviceksczTime, ����ʱ��
          //fault_current.mvfaultDeviceDealPerson, ������Ա
          //fault_current.mvFaultCtime, ���ʱ��
          //fault_current.faultDealFeedback ���÷���

      ],
      "tableContent":{  //û�е���д""
          "1":[],   //[0]"�ڵ���",[1]"ϵͳ���",[2]"�쳣����",[3]"�ڵ�����",[4]"�ڵ�λ��",[5]"�ڵ�����",[6]"�쳣ʱ��",[7]"�쳣״̬",[8]"����ʱ��",[9]"������Ա",[10]"���ʱ��",[11]"���÷���"
          "2":[],
          "3":[]
      },
      "totalNum":8234,
      "page":1,
      "lengthPerPage":20,
      "totalPage":412
  }
};

/*���������  ��λ¥��ͼ���λλ����Ϣ Ajax*/
sendData = {"controller":"FaultQuery","nodeID":"11010110011"};
getData = [
    {
        "x_axis":"500",
        "y_axis":"500",
        "pictureNodeID":"1",
        "pictureAddres":"images/floor/1010/B-22-1.png"
    }
];


/*abnormalAnalysislҳ��*/
/*��һ�μ��� & ��ϵͳѡ��*/
/**
 controller=ExceptionAnalysis&jsonPara={"system":"1,2","choice":"1"}
 system��1ˮϵͳ��2������7�����Ѳ��  ����Ҫ�д˲��� ȫѡΪ"1,2,7"
 choice: 1�쳣����, 2��������
**/
sendData = {"controller":"ExceptionAnalysis","jsonPara":{"system":"1,2","choice":"1"}};
getData = {
    "total":[4117,4116,1,0],            //[0]total [1]in [2]not [3]yet
    "year":[4117,4116,1,0],
    "month":[4117,4116,1,0],
    "day":[0,0,0,0],
    "excepTendency":{
        "date":["05-11","05-12","05-13","05-14","05-15","05-16","05-17"],
        "Ԥ��":[0,0,0,0,3,0,0],           //�쳣����Ϊ���Ϻ�Ԥ������������Ϊ��
        "����":[0,0,0,0,4114,0,0]
    },
    "excepBuilding":{
        "����ѧ¥":4117
    }
};
/*����*/
/**
 --���ɸѡ
 controller=ExceptionTendency&jsonPara={"system":"1,2","choice":"1"��"substr(nodeID,2,2)":10,"substr(nodeID,2,4)":1010}&type=day&enum=lineExceptionTendencyByDay&num=30
 substr(nodeID,2,2)��У����
 substr(nodeID,2,4)��¥�����
 type=day��ʱ�䵥λ
 enum=lineExceptionTendencyByDay��ʱ�䵥λ��Ӧ��enum,lineExceptionTendencyBy+ʱ�䵥λ(����ĸ��д)����lineExceptionTendencyByDay
 num=30��ͳ�ƶ���ʱ�䵥λ����ݣ�����type=day&num=30����30��
 --ʱ��ɸѡ
 controller=ExceptionTendency&jsonPara={"system":"1,2","choice":"1"��"timeStart":"2017-04-01","timeEnd":"2017-05-01","substr(nodeID,2,2)":10,"substr(nodeID,2,4)":1010}
 substr(nodeID,2,2)��У����
 substr(nodeID,2,4)��¥�����
**/
/*���ʱ��ɸѡ  ��һ��  ��һ��  ��һ��*/
sendData = {
    "controller":"ExceptionTendency",
    "jsonPara":{
        "system":"1,2",                 //system��1ˮϵͳ��2������7�����Ѳ��  ����Ҫ�д˲��� ȫѡΪ"1,2,7"
        "choice":"1",                   //choice: 1�쳣����, 2��������
        "substr(nodeID,2,2)":"10",      //substr(nodeID,2,2)��У����
        "substr(nodeID,2,4)":"1010"     //substr(nodeID,2,4)��¥�����
    },
    "type":"month",                       //��һ�ܣ�type=day,enum=lineExceptionTendencyByDay,num=7
    "enum":"lineExceptionTendencyByMonth",//��һ�£�type=day,enum=lineExceptionTendencyByDay,num=30
    "num":12                            //��һ�꣺type=month,enum=lineExceptionTendencyByMonth,num=12
};
getData = {
    "chartItem":{
        "date":["2016-06","2016-07","2016-08","2016-09","2016-10","2016-11","2016-12","2017-01","2017-02","2017-03","2017-04","2017-05"],
        "Ԥ��":[0,0,0,0,0,0,0,0,0,0,0,3],
        "����":[0,0,0,0,0,0,0,0,0,0,0,4114]
    }
};
/*2
* {"chartItem":{"date":["2016-06","2016-07","2016-08","2016-09","2016-10","2016-11","2016-12","2017-01","2017-02","2017-03","2017-04","2017-05"],"��":[0,0,0,0,0,0,0,0,0,0,0,4114]}}*/
/*����ʱ��ɸѡ*/
sendData = {
    "controller":"ExceptionTendency",
    "jsonPara":{
        "system":"1,2",                 //system��1ˮϵͳ��2������7�����Ѳ��  ����Ҫ�д˲��� ȫѡΪ"1,2,7"
        "choice":"1",                   //choice: 1�쳣����, 2��������
        "timeStart":"2017-04-01",       //��ʼ����
        "timeEnd":"2017-05-01",         //��ֹ���ڣ����ܳ���30�죩
        "substr(nodeID,2,2)":"10",      //substr(nodeID,2,2)��У����
        "substr(nodeID,2,4)":"1010"     //substr(nodeID,2,4)��¥�����
    }
};
/*¥��*/
/**
 --���ɸѡ
 controller=ExceptionBuilding&jsonPara={"system":"1,2"��"choice":"1"}&type=day&enum=pieExceptionBuildingByDay&num=30
 type=day&enum=pieExceptionBuildingByDay���̶���������Ϊ��λ
 num=30��ͳ�ƶ���������
 --ʱ��ɸѡ
 controller=ExceptionBuilding&jsonPara={"system":"1,2","choice":"1"��"timeStart":"2017-04-01","timeEnd":"2017-05-01","substr(nodeID,2,2)":10,"substr(nodeID,2,4)":1010}
 substr(nodeID,2,2)��У����
 substr(nodeID,2,4)��¥�����
**/
/*���ʱ��ɸѡ  ��һ��  ��һ��  ��һ��*/
sendData = {
    "controller":"ExceptionBuilding",
    "jsonPara":{"system":"1,2","choice":"1"},
    "type":"day",                       //��һ�ܣ�type=day,enum=pieExceptionBuildingByDay,num=7
    "enum":"pieExceptionBuildingByDay", //��һ�£�type=day,enum=pieExceptionBuildingByDay,num=30
    "num":30                            //��һ�꣺type=month,enum=pieExceptionBuildingByMonth,num=12
};
getData = {
    "chartItem":{
        "����ѧ¥":4117
    }
};
/*����ʱ��ɸѡ*/
sendData = {
    "controller":"ExceptionBuilding",
    "jsonPara":{
        "system":"1,2",                 //system��1ˮϵͳ��2������7�����Ѳ��  ����Ҫ�д˲��� ȫѡΪ"1,2,7"
        "choice":"1",                   //choice: 1�쳣����, 2��������
        "timeStart":"2017-04-01",       //��ʼ����
        "timeEnd":"2017-05-01",         //��ֹ���ڣ����ܳ���30�죩
        "substr(nodeID,2,2)":"10",      //substr(nodeID,2,2)��У����
        "substr(nodeID,2,4)":"1010"     //substr(nodeID,2,4)��¥�����
    }
};


/*���߷���/֪ͨ����ҳ��*/
/*ajax ģ���ѯ*/
sendData={
    "page":"",        //"notificationdocument"-֪ͨ����  "policeandregulation"-���߷���
    "searchValue":"",
    "controller":"FuzzySearch"
};
getData=[
    {
        "Address":"",       //�ļ�λ��
        "CreatTime":"",     //�ļ�����/�ϴ�ʱ��
        "Name":"",          //�ļ����
        "Id":""             //�ļ�Id
    },
    {},{}
];