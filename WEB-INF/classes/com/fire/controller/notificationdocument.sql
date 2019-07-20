/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50718
Source Host           : localhost:3306
Source Database       : fire

Target Server Type    : MYSQL
Target Server Version : 50718
File Encoding         : 65001

Date: 2017-05-17 20:04:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for notificationdocument
-- ----------------------------
DROP TABLE IF EXISTS `notificationdocument`;
CREATE TABLE `notificationdocument` (
  `NotificationDocumentID` int(20) NOT NULL AUTO_INCREMENT,
  `DocumentName` varchar(255) DEFAULT NULL,
  `DocumentAddress` varchar(255) DEFAULT NULL,
  `DocumentCreatTime` date DEFAULT NULL,
  PRIMARY KEY (`NotificationDocumentID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of notificationdocument
-- ----------------------------
INSERT INTO `notificationdocument` VALUES ('1', '\"夏季车辆易自燃 沙坪坝消防支招如何防范和应对发生地震怎么办 ?田消防温馨提醒您不要惊慌', '地震事件.docx', '2017-05-17');
INSERT INTO `notificationdocument` VALUES ('2', '重庆沙坪坝提醒：关注校园消防安全,校园火灾安全事件是现代社会备受关注的热点 ', '校园安全.docx', '2017-05-17');
INSERT INTO `notificationdocument` VALUES ('3', '重庆沙坪坝消防发布超市防火\'四须知\',以及关注厨房防火那些事儿，天气炎热期间应当牢记一些消防守则，遇到火灾时请不要惊慌失措，先适当做紧急安全处理，并第一时间内拨打119火警电话', '家庭安全.docx', '2017-05-17');
SET FOREIGN_KEY_CHECKS=1;
