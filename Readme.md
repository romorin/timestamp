# romorin-timestamp

My Free Code Camp [timestamp microservice](https://www.freecodecamp.com/challenges/timestamp-microservice) page. Can also be seen on [Heroku](https://romorin-timestamp.herokuapp.com) or on the [web](http://romorin.com/timestamp/).

Pass a natural date (January 1, 2016) or a timestamp (1450137600) as a parameter and returns json containing both.
If no valid input, returns json containing null to both fields.

Example :

https://romorin-timestamp.herokuapp.com/September%2009%202001
https://romorin-timestamp.herokuapp.com/999993600

Returns :

{"unix":999993600,"natural":"September 09, 2001"}

https://romorin-timestamp.herokuapp.com/Hello
https://romorin-timestamp.herokuapp.com/

Returns :

{"unix":null,"natural":null}

Released under the MIT license.
