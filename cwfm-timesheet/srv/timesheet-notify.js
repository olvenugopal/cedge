const { NotificationService } = require("./notifications-util");

const NOTIF_TYPE_KEY = "CWFMTimesheet";
const NOTIF_TYPE_VERSION = "0.1";

function createNotificationType() {
    return {
        NotificationTypeKey: NOTIF_TYPE_KEY,
        NotificationTypeVersion: NOTIF_TYPE_VERSION,
        Templates: [
            {
                Language: "en",
                TemplateSensitive: "Timesheet {{recordNumber}} requires Approvals",
                TemplatePublic: "Timesheet Approvals Required",
                TemplateGrouped: "Timesheet Approvals",
                TemplateLanguage: "Mustache",
                Subtitle: "Please approve Timesheet {{recordNumber}} for PartnerID {{partnerID}} and Work Date {{workDate}}"
            }
        ],
        Actions: [
            {
                ActionId: "Approve",
                ActionText: "Approve",
                GroupActionText: "ApproveAll",
                Nature: "POSITIVE"
            },
            {
                ActionId: "Reject",
                ActionText: "Reject",
                GroupActionText: "RejectAll",
                Nature: "NEGATIVE"
            }
        ]
    }
}

function createNotification({ notificationId, recordNumber, partnerID, workDate, recipients }) {

    return {
        Id: notificationId,
        OriginId: "",
        NotificationTypeKey: NOTIF_TYPE_KEY,
        NotificationTypeVersion: NOTIF_TYPE_VERSION,
        NavigationTargetAction: "display",
        NavigationTargetObject: "cwfmTimesheet",
        Priority: "High",
        ProviderId: "",
        ActorId: "",
        ActorType: "",
        ActorDisplayText: "",
        ActorImageURL: "",
        Properties: [
            {
                Key: "recordNumber",
                Language: "en",
                Value: recordNumber,
                Type: "String",
                IsSensitive: false
            },
            {
                Key: "partnerID",
                Language: "en",
                Value: partnerID,
                Type: "String",
                IsSensitive: false
            },
            {
                Key: "workDate",
                Language: "en",
                Value: workDate,
                Type: "String",
                IsSensitive: false
            }
        ],
        Recipients: recipients.map(recipient => ({ RecipientId: recipient })),
    }
}

async function publishTimesheetApprovalNotification(notification) {
    console.log(`Entered method: publishTimesheetApprovalNotification()`);
    const notifTypes = await NotificationService.getNotificationTypes();
    console.log(`Got all the Notification Types`);
    const notifType = notifTypes.find(nType => nType.NotificationTypeKey === NOTIF_TYPE_KEY && nType.NotificationTypeVersion === NOTIF_TYPE_VERSION);
    if (!notifType) {
        console.log(`Notification Type of key ${NOTIF_TYPE_KEY} and version ${NOTIF_TYPE_VERSION} was not found. Creating it...`);
        await NotificationService.postNotificationType(createNotificationType());
    }    
    return await NotificationService.postNotification(createNotification(notification));
}

module.exports = { publishTimesheetApprovalNotification };