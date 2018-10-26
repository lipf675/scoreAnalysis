-- phpMyAdmin SQL Dump
-- version phpStudy 2014
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2018 年 10 月 22 日 05:56
-- 服务器版本: 5.5.53
-- PHP 版本: 5.4.45

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `scoreanalysis`
--

-- --------------------------------------------------------

--
-- 表的结构 `class`
--

CREATE TABLE IF NOT EXISTS `class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classname` varchar(2555) NOT NULL,
  `gradeId` int(11) NOT NULL,
  `classDirector` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=24 ;

--
-- 转存表中的数据 `class`
--

INSERT INTO `class` (`id`, `classname`, `gradeId`, `classDirector`) VALUES
(2, '2018级2班', 1, 0),
(3, '2018级3班', 1, 364),
(22, '2018级4班', 1, 362),
(23, '2018级4班', 1, 361);

-- --------------------------------------------------------

--
-- 表的结构 `classdirector`
--

CREATE TABLE IF NOT EXISTS `classdirector` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `starttime` date NOT NULL,
  `endtime` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `exam`
--

CREATE TABLE IF NOT EXISTS `exam` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gradeid` int(11) NOT NULL,
  `classid` varchar(255) NOT NULL,
  `subjectid` varchar(255) NOT NULL,
  `examname` varchar(255) NOT NULL,
  `startdate` date NOT NULL,
  `fullscore` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `grade`
--

CREATE TABLE IF NOT EXISTS `grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `gradename` varchar(255) NOT NULL COMMENT '年级名称',
  `startdate` varchar(255) NOT NULL COMMENT '入学时间',
  `enddate` varchar(255) CHARACTER SET utf32 NOT NULL COMMENT '毕业时间',
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '状态（0：毕业，1：一年级，2：二年级，3：三年级）',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=35 ;

--
-- 转存表中的数据 `grade`
--

INSERT INTO `grade` (`id`, `gradename`, `startdate`, `enddate`, `status`) VALUES
(1, '2018级', '2018-09', '2021-06', 1),
(2, '2017级', '2017-09', '2020-06', 2),
(3, '2016级', '2016-09', '2019-06', 3),
(4, '2015级', '2015-09', '2018-06', 0),
(5, '2014级', '2014-09', '2017-06', 0),
(20, '2013级', '2013-09', '2016-06', 0);

-- --------------------------------------------------------

--
-- 表的结构 `gradedirector`
--

CREATE TABLE IF NOT EXISTS `gradedirector` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `gradeid` int(11) NOT NULL COMMENT '年级id',
  `userid` int(11) NOT NULL COMMENT '用户id',
  `startTime` date NOT NULL COMMENT '开始时间',
  `endTime` date NOT NULL COMMENT '结束时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `score`
--

CREATE TABLE IF NOT EXISTS `score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentid` int(11) NOT NULL,
  `subjectid` int(11) NOT NULL,
  `examid` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `student`
--

CREATE TABLE IF NOT EXISTS `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classid` int(11) NOT NULL,
  `studentname` varchar(256) NOT NULL,
  `startdate` date NOT NULL,
  `enddate` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf16 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `subject`
--

CREATE TABLE IF NOT EXISTS `subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `subjectname` varchar(255) NOT NULL COMMENT '学科名称',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

--
-- 转存表中的数据 `subject`
--

INSERT INTO `subject` (`id`, `subjectname`) VALUES
(1, '数学'),
(2, '语文'),
(3, '英语'),
(4, '物理'),
(5, '化学'),
(6, '生物'),
(7, '政治'),
(8, '地理'),
(9, '历史'),
(10, '体育'),
(11, '音乐'),
(12, '美术');

-- --------------------------------------------------------

--
-- 表的结构 `teaching`
--

CREATE TABLE IF NOT EXISTS `teaching` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `classid` int(11) NOT NULL COMMENT 'classid',
  `subjectid` int(11) NOT NULL COMMENT 'subjectid',
  `teacherid` int(11) NOT NULL COMMENT 'teacherid',
  `starttime` date NOT NULL,
  `endtime` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

--
-- 转存表中的数据 `teaching`
--

INSERT INTO `teaching` (`id`, `classid`, `subjectid`, `teacherid`, `starttime`, `endtime`) VALUES
(1, 1, 1, 362, '0000-00-00', '0000-00-00'),
(2, 22, 1, 362, '0000-00-00', '0000-00-00'),
(3, 22, 2, 354, '0000-00-00', '0000-00-00'),
(4, 22, 3, 344, '0000-00-00', '0000-00-00'),
(5, 22, 4, 334, '0000-00-00', '0000-00-00'),
(6, 22, 5, 318, '0000-00-00', '0000-00-00'),
(7, 22, 6, 309, '0000-00-00', '0000-00-00'),
(8, 22, 7, 301, '0000-00-00', '0000-00-00'),
(9, 22, 8, 291, '0000-00-00', '0000-00-00'),
(10, 22, 9, 281, '0000-00-00', '0000-00-00'),
(11, 22, 10, 271, '0000-00-00', '0000-00-00'),
(12, 22, 11, 261, '0000-00-00', '0000-00-00'),
(13, 22, 12, 251, '0000-00-00', '0000-00-00'),
(14, 23, 1, 362, '0000-00-00', '0000-00-00'),
(15, 23, 2, 354, '0000-00-00', '0000-00-00'),
(16, 23, 3, 344, '0000-00-00', '0000-00-00'),
(17, 23, 4, 334, '0000-00-00', '0000-00-00'),
(18, 23, 5, 318, '0000-00-00', '0000-00-00'),
(19, 23, 6, 309, '0000-00-00', '0000-00-00'),
(20, 23, 7, 301, '0000-00-00', '0000-00-00'),
(21, 23, 8, 291, '0000-00-00', '0000-00-00'),
(22, 23, 9, 281, '0000-00-00', '0000-00-00'),
(23, 23, 10, 271, '0000-00-00', '0000-00-00'),
(24, 23, 11, 261, '0000-00-00', '0000-00-00'),
(25, 23, 12, 251, '0000-00-00', '0000-00-00');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(11) NOT NULL COMMENT '密码',
  `isAdmin` int(1) NOT NULL COMMENT '是否为管理员',
  `teaching` varchar(255) NOT NULL COMMENT '教授的学科',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=365 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `isAdmin`, `teaching`) VALUES
(1, 'admin', '1234', 1, ''),
(364, '庞老师', '000000', 0, '2'),
(363, '茅老师', '000000', 0, '1'),
(362, '谈老师', '000000', 0, '1'),
(361, '宋老师', '000000', 0, '1'),
(360, '成老师', '000000', 0, '1'),
(359, '戴老师', '000000', 0, '1'),
(358, '伏老师', '000000', 0, '1'),
(357, '计老师', '000000', 0, '1'),
(356, '臧老师', '000000', 0, '1'),
(355, '贝老师', '000000', 0, '1'),
(354, '明老师', '000000', 0, '2'),
(353, '米老师', '000000', 0, '2'),
(352, '狄老师', '000000', 0, '2'),
(351, '禹老师', '000000', 0, '2'),
(350, '毛老师', '000000', 0, '2'),
(349, '祁老师', '000000', 0, '2'),
(348, '汪老师', '000000', 0, '2'),
(347, '湛老师', '000000', 0, '2'),
(346, '邵老师', '000000', 0, '2'),
(345, '尹老师', '000000', 0, '1'),
(344, '姚老师', '000000', 0, '3'),
(343, '萧老师', '000000', 0, '3'),
(342, '穆老师', '000000', 0, '3'),
(341, '和老师', '000000', 0, '3'),
(340, '黄老师', '000000', 0, '3'),
(339, '孟老师', '000000', 0, '3'),
(338, '平老师', '000000', 0, '3'),
(337, '顾老师', '000000', 0, '3'),
(336, '余老师', '000000', 0, '3'),
(335, '卜老师', '000000', 0, '3'),
(334, '元老师', '000000', 0, '4'),
(333, '齐老师', '000000', 0, '4'),
(332, '伍老师', '000000', 0, '4'),
(331, '康老师', '000000', 0, '4'),
(330, '皮老师', '000000', 0, '4'),
(329, '卞老师', '000000', 0, '4'),
(328, '傅老师', '000000', 0, '4'),
(327, '时老师', '000000', 0, '4'),
(326, '于老师', '000000', 0, '4'),
(325, '乐老师', '000000', 0, '4'),
(324, '常老师', '000000', 0, '5'),
(323, '邬老师', '000000', 0, '5'),
(322, '安老师', '000000', 0, '5'),
(321, '郝老师', '000000', 0, '5'),
(320, '罗老师', '000000', 0, '5'),
(319, '殷老师', '000000', 0, '5'),
(318, '毕老师', '000000', 0, '5'),
(317, '滕老师', '000000', 0, '5'),
(316, '汤老师', '000000', 0, '5'),
(315, '雷老师', '000000', 0, '5'),
(314, '倪老师', '000000', 0, '6'),
(313, '贺老师', '000000', 0, '6'),
(312, '薛老师', '000000', 0, '6'),
(311, '廉老师', '000000', 0, '6'),
(310, '岑老师', '000000', 0, '6'),
(309, '费老师', '000000', 0, '6'),
(308, '史老师', '000000', 0, '6'),
(307, '唐老师', '000000', 0, '6'),
(306, '鲍老师', '000000', 0, '6'),
(305, '酆老师', '000000', 0, '6'),
(304, '柳老师', '000000', 0, '7'),
(303, '袁老师', '000000', 0, '7'),
(302, '任老师', '000000', 0, '7'),
(301, '俞老师', '000000', 0, '7'),
(300, '方老师', '000000', 0, '7'),
(299, '花老师', '000000', 0, '7'),
(298, '凤老师', '000000', 0, '7'),
(297, '苗老师', '000000', 0, '7'),
(296, '马老师', '000000', 0, '7'),
(295, '昌老师', '000000', 0, '7'),
(294, '韦老师', '000000', 0, '8'),
(293, '鲁老师', '000000', 0, '8'),
(292, '郎老师', '000000', 0, '8'),
(291, '彭老师', '000000', 0, '8'),
(290, '范老师', '000000', 0, '8'),
(289, '奚老师', '000000', 0, '8'),
(288, '葛老师', '000000', 0, '8'),
(287, '潘老师', '000000', 0, '8'),
(286, '苏老师', '000000', 0, '8'),
(285, '云老师', '000000', 0, '8'),
(284, '窦老师', '000000', 0, '9'),
(283, '章老师', '000000', 0, '9'),
(282, '水老师', '000000', 0, '9'),
(281, '柏老师', '000000', 0, '9'),
(280, '喻老师', '000000', 0, '9'),
(279, '邹老师', '000000', 0, '9'),
(278, '谢老师', '000000', 0, '9'),
(277, '戚老师', '000000', 0, '9'),
(276, '姜老师', '000000', 0, '9'),
(275, '陶老师', '000000', 0, '9'),
(274, '魏老师', '000000', 0, '10'),
(273, '金老师', '000000', 0, '10'),
(272, '严老师', '000000', 0, '10'),
(271, '华老师', '000000', 0, '10'),
(270, '曹老师', '000000', 0, '10'),
(269, '孔老师', '000000', 0, '10'),
(268, '张老师', '000000', 0, '10'),
(267, '吕老师', '000000', 0, '10'),
(266, '许老师', '000000', 0, '10'),
(265, '何老师', '000000', 0, '10'),
(264, '施老师', '000000', 0, '11'),
(263, '尤老师', '000000', 0, '11'),
(262, '秦老师', '000000', 0, '11'),
(261, '韩老师', '000000', 0, '11'),
(260, '朱老师', '000000', 0, '11'),
(259, '杨老师', '000000', 0, '11'),
(258, '沈老师', '000000', 0, '11'),
(257, '蒋老师', '000000', 0, '11'),
(256, '卫老师', '000000', 0, '11'),
(255, '褚老师', '000000', 0, '11'),
(254, '陈老师', '000000', 0, '12'),
(253, '冯老师', '000000', 0, '12'),
(252, '王老师', '000000', 0, '12'),
(251, '郑老师', '000000', 0, '12'),
(250, '吴老师', '000000', 0, '12'),
(249, '李老师', '000000', 0, '12'),
(248, '周老师', '000000', 0, '12'),
(247, '孙老师', '000000', 0, '12'),
(245, '赵老师', '000000', 0, '12'),
(246, '钱老师', '000000', 0, '12');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
