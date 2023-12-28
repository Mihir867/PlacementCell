import mongoose from 'mongoose';
export const StudentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		college: {
			type: String,
			required: true,
		},
		placement: {
			type: String,
			required: true,
			enum: ['Placed', 'Not Placed'],
		},
		contactNumber: {
			type: Number,
			required: true,
		},
		Year: {
			type: Number,
			required: true,
		},
		dsa: {
			type: Number,
			required: true,
		},
		webd: {
			type: Number,
			required: true,
		},
		react: {
			type: Number,
			required: true,
		},
		company: {
					type: String,
					required :true
				},
				
	},
);


