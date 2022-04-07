'use strict';
const cds = require('@sap/cds');
const log = require('cf-nodejs-logging-support');

class ProcessingEngine {
    constructor() {
        this.jobActive = false;
        this.checkQry = SELECT.one`count(RecordKey) as rowCount`.from`Timesheet`.where`Status_code = 'CREA'`;
    }

    /**
     * Method to process timesheets which are in 'Created' status
     */
    processTimesheets(tx) {
        let processFn = `call "processTimesheets"( )`;
        tx.run(processFn);
        log.info("[CWFM] Successfully processed the timesheets using HANA procedures");
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
            log.info("[CWFM] A Job is submitted (triggers in %ims) to process %i timesheets", interval, checkResult.rowCount);
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