'use strict';

const cds = require('@sap/cds');
const prc = require('./processing-engine');
const log = require('cf-nodejs-logging-support');
const uaa = require('@sap/xsenv');

class TimesheetService extends cds.ApplicationService {

    async setStatusForAllPending(status) {
        let entity = cds.entities('cwfm').Timesheets;
        let rows = await SELECT("*").from(entity).where({ status_code: 'PEND' });
        console.log("[CWFM] Number of records to be approved/rejected: %i", rows.length);
        for (let i = 0; i < rows.length; ++i) {
            await UPDATE(entity, rows[i].Id).with({ status_code: status });
        }
    }

    init() {

        /**
         * Process all Timesheets in 'Created' status
         */
        this.on('processTimesheets', async req => {
            log.info("[CWFM] Entered Action handler for 'processTimesheets'");
        });

        /**
         * Callback from Notification Service - Single Entity
         */
        this.on('ExecuteAction', async req => {
            log.info("[CWFM] Entered Action handler for 'ExecuteAction'");
            console.log("[CWFM] req.params value is %s", req.params[0]);
            console.log("[CWFM] req.data value is");
            console.log(req.data);
            await this.setStatusForAllPending('APPR');
            return { Success: true, MessageText: "Timesheet is Approved Successfully", DeleteOnReturn: true };
        });

        /**
         * Callback from Notification Service - Bulk Mode
         */
        this.on('BulkActionByHeader', async req => {
            log.info("[CWFM] Entered Action handler for 'BulkActionByHeader'");
            await this.setStatusForAllPending('APPR');
            return { Success: true, MessageText: "Timesheets are Approved Successfully", DeleteOnReturn: true };
        });

        /**
         * Before CREATE of Timesheets
         */
        this.before(['CREATE'], 'Timesheets', async (req) => {
            log.info("[CWFM] Entered Event handler 'BeforeCreate' of Timesheets");
            req.data.status_code = 'CREA';
        });

        /**
         * After CREATE of Timesheets
         */
        this.after(['CREATE'], 'Timesheets', async (results, req) => {
            log.info("[CWFM] Entered Event handler 'AfterCreate' of Timesheets");
            prc.triggerJob();
        });

        /**
         * After UPDATE of Timesheets
         */
        this.after(['UPDATE'], 'Timesheets', async (results, req) => {
            log.info("[CWFM] Entered Event handler 'AfterUpdate' of Timesheets");
            //const AuditLogService = await cds.connect.to('audit-log');
            //await AuditLogService.emit('TimesheetUpdated', { results });
            await UPDATE(req.target, results.ID).with({ status_code: 'UPDT', statusReason_code: '' });
            prc.triggerJob();
        });

        /**
         * Before READ of Timesheets
         */
        this.before(['READ'], 'Timesheets', (req) => {
            log.info("[CWFM] Entered Event handler 'BeforeRead' of Timesheets");
            let delay = (process.env.response_delay === undefined) ? 0 : Number(process.env.response_delay);
            log.info("[CWFM] Delay Time Config: %i", delay);
            if (delay !== 0) {
                prc.wait(delay);
            }
        });

        /**
         * Set the criticality value for each of the rows
         */
        this.after(['READ'], 'Timesheets', (each) => {
            if (each.matchScore > 0 && each.matchScore <= 0.6) {
                each.criticality = 1;
            }
            else if (each.matchScore > 0.6 && each.matchScore <= 0.9) {
                each.criticality = 2;
            }
            else if (each.matchScore > 0.9) {
                each.criticality = 3;
            }
            else {
                each.criticality = 0;
            }
        });

        /**
         * Approve Action - Set status accordingly
         */
        this.on('approveTimesheet', async (req) => {
            let guid = (req.data.ID === undefined) ? req.params[0].ID : req.data.ID;
            let rows = await SELECT("*").from(req.target).where({ id: guid });
            if (rows.length) {
                switch (rows[0].status_code) {
                    case 'PEND':
                    case 'PROC':
                        await UPDATE(req.target, guid).with({ status_code: 'APPR' });
                        break;
                    case 'APPR':
                        req.error(200, 'Timesheet is already Approved');
                        break;
                    default:
                        req.error(400, `Please select a Timesheet in status 'Pending Approval'`);
                        break;
                }
            }
        });

        /**
         * Reject Action - Set status accordingly
         */
        this.on('rejectTimesheet', async (req) => {
            let guid = (req.data.ID === undefined) ? req.params[0].ID : req.data.ID;
            let rows = await SELECT("*").from(req.target).where({ id: guid });
            if (rows.length) {
                switch (rows[0].status_code) {
                    case 'PROC':
                    case 'PEND':
                        await UPDATE(req.target, guid).with({ status_code: 'REJE' });
                        break;
                    case 'REJE':
                        req.error(200, 'Timesheet is already Rejected');
                        break;
                    default:
                        req.error(400, `Please select a Timesheet in status 'Pending Approval'`);
                        break;
                }
            }
        });

        // Add base class's handlers. Handlers registered above go first.
        return super.init();
    }
}

module.exports = TimesheetService
