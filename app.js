const express = require('express')
const https = require('https');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
	let counter = 0;
	setInterval( function () {
		
		counter++;
		console.log("counter -----------"+counter);
		httpCall();
	}, 30000);
})

var httpCall = function(){
	https.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=305&date=10-05-2021', (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			checkstaus(data);
			console.log("no slots -----------");
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

var checkstaus = function(response){
	let emailText = "";
	response = JSON.parse(response)
	response.centers.forEach((center)=> {
		center.sessions.forEach((session)=> {
			if(session.available_capacity > 0){
				emailText + "center - "+ center.name + ",capacity - " + session.available_capacity + ", age" + session.min_age_limit+ "<br>"
			}
		});
	});
	if(emailText.length > 0){
		console.log("found a slot -----------");
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	}
	
	
}



var transporter = nodemailer.createTransport({
	//https://www.google.com/settings/security/lesssecureapps - go here and allow less secure apps
  service: 'gmail',
  auth: {
    user: 'tpaslam@gmail.com',
    pass: 'Mehak@100'
  }
});

var mailOptions = {
  from: 'tpaslam@gmail.com',
  to: 'tpaslam@gmail.com',
  subject: 'vaccine available',
  text: 'Test email'
};
