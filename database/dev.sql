SET NAMES utf8;
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

DROP TABLE IF EXISTS `schedule`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `schedule` 
(
`id` mediumint(9) NOT NULL AUTO_INCREMENT NOT NULL,
`user_id` mediumint(9) NOT NULL,
`open_date` DATE NOT NULL,
`start_time` TIME NOT NULL,
`stop_time` TIME NOT NULL,
`duration` TIME NOT NULL,
`booked_by` TEXT NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `schedule` (`id`, `user_id`, `open_date`, `start_time`, `stop_time`, `duration`,  `booked_by`) VALUES
(0, 0, '2020-01-09', '9:00', '10:00', TIMEDIFF(stop_time, start_time), 'David');


CREATE TABLE `user` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `password` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `user` (`id`, `password`, `username`) VALUES
(0, 'testuser0', 'testuser0'),
(1,	'testuser1', 'testuser1'),
(2,	'testuser2', 'testuser2'),
(3, 'David', 'David');
