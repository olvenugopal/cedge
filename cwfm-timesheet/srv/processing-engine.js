'use strict';
const cds = require('@sap/cds');

class ProcessingEngine {
    constructor() {
        this.jobActive = false;
        this.checkQry = SELECT.one`count(TimesheetRecordKey) as rowCount`.from`Timesheet`.where`TimesheetStatus_code = 'CR'`;
    }

    /**
     * Method to process timesheets which are in 'Created' status
     */
    processTimesheets(tx) {
        let processFn = `call "processTimesheets"( )`;
        tx.run(processFn);
        console.log('Successfully processed the timesheets using HANA procedures');
    }

    /**
     * Method to process timesheets which are in 'Created' status
     */
    async jobCallback(tx) {
        const prc = require('./processing-engine');
        prc.processTimesheets(tx);
        prc.jobActive = false;
        prc.triggerJob();
        return true;
    }

    /**
     * Method to process timesheets which are in 'Created' status
     */
    async triggerJob() {
        if (this.jobActive) { return; }
        let checkResult = await cds.run(this.checkQry);
        if (checkResult.rowCount) { // Are there records to be processed? then submit the job
            const interval = 1000;
            cds.spawn({ after: interval /* ms */ }, this.jobCallback);
            this.jobActive = true;
            console.log('A Job is submitted (triggers in %ims) to process %i timesheets', interval, checkResult.rowCount);
        }
    }

    /**
     * Method to wait for a couple of ms
     */
    wait(ms) {
        let start = new Date().getTime();
        let end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }
}

module.exports = new ProcessingEngine();