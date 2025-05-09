import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['company_verification', 'job_posted', 'application_received'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'targetModel',
        required: true
    },
    targetModel: {
        type: String,
        enum: ['Company', 'Job', 'Application'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true, versionKey: false });

export const Notification = mongoose.model("Notification", notificationSchema);
