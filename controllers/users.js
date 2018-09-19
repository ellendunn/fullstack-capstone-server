'use strict'

const express = require('express');
const {User} = require('../models/user')

exports.postUser = (req, res) => {
	const requiredFields = ['username', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	const stringFields = ['username', 'password', 'firstName', 'lastName'];
	const notStringFields = stringFields.find(field => {
		return field in req.body && typeof req.body[field] !== 'string'
	});

	if (notStringFields) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Incorrect field type: expected string',
			location: notStringFields
		});
	}

	//Trimming the username and password from spaces
	const trimmedFields = ['username', 'password'];
	const nonTrimmedfield = trimmedFields.find(
		field => req.body[field].trim() != req.body[field]
		)

	if(nonTrimmedfield) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Cannot start or end field with whitespace',
			location: nonTrimmedfield
		});
	}

	const sizedFields = {
		username: {	min: 1 },
		password: { min: 6, max: 72 }
	};

	const tooShortField = Object.keys(sizedFields).find((field) =>
		'min' in sizedFields[field] &&
					req.body[field].trim().length < sizedFields[field].min
	);

	const tooLongField = Object.keys(sizedFields).find((field) =>
		'max' in sizedFields[field] &&
					req.body[field].trim().length > sizedFields[field].max
	);

	if (tooShortField || tooLongField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: tooShortField
				? `Password must be at least ${sizedFields[tooShortField].min} characters long`
				: `Password cannot exceed ${sizedFields[tooLongField].max} characters`,
			location: tooShortField || tooLongField
		});
	}

	let {username, password, location='', firstName = '', lastName = ''} = req.body;
	firstName = firstName.trim();
	lastName = lastName.trim();
	location = location.trim();

	return User.find({username})
		.count()
		.then(count => {
			if (count > 0) {
				return Promise.reject({
				code: 422,
				reason: 'ValidationError',
				message: 'Username is already taken',
				location: 'username'
				});
			}
			return User.hashPassword(password);
		})
		.then(hash => {
			return User.create({
				firstName,
				lastName,
				username,
				password: hash
			});
		})
		.then(user => {
			return res.status(201).json(user.serialize());
		})
		.catch(err => {
			if (err.reason = 'ValidationError') {
				return res.status(err.code).json(err);
			}t
			res.status(500).json({code: 500, message: 'Internal Server Error'})
		});
};
