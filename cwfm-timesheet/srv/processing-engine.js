'use strict';
const { v4: uuidv4 } = require('uuid');
const cds = require('@sap/cds');
const log = require('cf-nodejs-logging-support');
const ntf = require('./timesheet-notify');

class ProcessingEngine {
    constructor() {
        this.jobActive = false;
        this.checkQry = SELECT.one`count(ID) as rowCount`.from`Timesheets`.where`status_code IN ('CREA','UPDT')`;
    }

    /**
     * Method to process timesheets which are in 'Created' or 'Updated' status
     */
    async processTimesheets(tx) {
        try {
            let processFn = `call "processTimesheets"( )`;
            await tx.run(processFn);
            log.info("[CWFM] Successfully processed the timesheets using HANA procedures");
        }
        catch (err) {
            log.info("[CWFM] Failed to process timesheets using HANA procedures");
        }
    }

    /**
     * Method to process timesheets which are in 'Created' or 'Updated' status
     */
    async jobCallback(tx) {
        const prc = require('./processing-engine');
        await prc.processTimesheets(tx);
        await prc.notify();
        prc.jobActive = false;
        prc.triggerJob();
        return true;
    }

    /**
     * Method to process timesheets which are in 'Created' or 'Updated' status
     */
    async triggerJob() {
        if (this.jobActive) { return; }
        let checkResult = await cds.run(this.checkQry);
        if (checkResult.rowCount) { // Are there records to be processed? then submit the job
            const interval = (process.env.submit_job_after === undefined) ? 100 : Number(process.env.submit_job_after);
            cds.spawn({ after: interval /* ms */ }, this.jobCallback);
            this.jobActive = true;
            log.info("[CWFM] A Job is submitted (triggers in %ims) to process %i timesheets", interval, checkResult.rowCount);
        }
    }

    /**
     * Method to wait for a couple of ms
     */
    async wait(ms) {
        let start = new Date().getTime();
        let end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    /**
     * Method to trigger a notification for Approvals of Timesheets
     */
    async notify() {
        console.log("Entered the method 'Notify'");
        let rows = await SELECT("*").from('Timesheets').where({ status_code: 'PROC' });
        rows.map(row => this.sendNotification(row));
    }

    async sendNotification(row) {
        let recipient = (process.env.notif_recipient === undefined) ? "lakshmi.venugopal.ogirala@sap.com" : process.env.notif_recipient;
        let notification = {
            notificationId: (row.notificationId === undefined || row.notificationId === null) ? uuidv4() : row.notificationId,
            recordNumber: row.recordNumber,
            partnerID: row.partnerID,
            workDate: row.workDate,
            recipients: [`${recipient}`]
        };
        console.log("Publishing Notification for Timesheet");
        console.log(notification);
        console.log(row);
        try {
            let response = ntf.publishTimesheetApprovalNotification(notification);
            console.log("Updating status to PEND for Row %s", row.ID);
            await UPDATE('Timesheets', row.ID).with({ status_code: 'PEND', statusReason_code: '' });
        }
        catch (err) {
            console.log("Error occurred during sendNotification");
        }
    }
}

module.exports = new ProcessingEngine();