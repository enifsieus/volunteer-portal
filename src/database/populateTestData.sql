/* ************************************************ */
/* This script must be run as a database superuser  */
/* or as Nyan Cat.								    */
/*													*/
/* Target database engine: MySQL 5.7.20             */
/*                                                  */
/* @author jjoseph                                  */
/* @since Nov 2017                                  */
/* ************************************************ */

/* This script doesn't have any use in production. It's just for us
 * developers. Its purpose is to facilitate the transition from 
 * hardcoded "fake store" endpoints to real endpoints based on an
 * SQL back-end. During the transition time where we have means of
 * _reading_ the DB with proper API calls but no way of populating it
 * via the web interface yet, we use this to fill the DB with data.
 */

/* This is meant to be run once, immediately after createSchema.sql. */

/* ************************************************************************* */

USE nyanPortal;

INSERT INTO users (firstName,lastName,email,photo,password)
  VALUES ('Pinchy','McPinchface','butts@butts.com','pinchy.jpg', '$2a$08$vuIFiKM3Vxv4sBWzRIgCKuXiAIeqm0l.9TN5OWPOhwXCfDXg.chOu');
INSERT INTO events (name, edition, description, startDateTime, endDateTime,
                    registrationStart, registrationEnd, , lotteryStatus, photo)
  VALUES ('UMADBRO', '2019', 'You might actually die by rapid oxidation',
          '2019-08-26', '2019-09-02', 'prereg',
          NOW(), '2019-08-25 00:00:00',
          'umadbro.jpg');


