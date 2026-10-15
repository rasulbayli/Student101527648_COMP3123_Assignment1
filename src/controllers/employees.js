const Employee = require('../models/Employee');

async function list(req, res, next) {
  try { res.status(200).json({ employees: await Employee.find({ user: req.auth.sub }).sort({ created_at: -1 }) }); } catch (e) { next(e); }
}
async function create(req, res, next) {
  try { const employee = await Employee.create({ ...req.body, user: req.auth.sub }); res.status(201).json({ message: 'Employee created', employee }); } catch (e) { next(e); }
}
async function get(req, res, next) {
  try { const employee = await Employee.findOne({ _id: req.params.eid, user: req.auth.sub }); if (!employee) return res.status(404).json({ error: 'Employee not found' }); res.status(200).json({ employee }); } catch (e) { next(e); }
}
async function update(req, res, next) {
  try { const fields = ['first_name', 'last_name', 'email', 'position', 'salary', 'date_of_joining', 'department']; const changes = Object.fromEntries(fields.filter(key => req.body[key] !== undefined).map(key => [key, req.body[key]])); const employee = await Employee.findOneAndUpdate({ _id: req.params.eid, user: req.auth.sub }, changes, { new: true, runValidators: true }); if (!employee) return res.status(404).json({ error: 'Employee not found' }); res.status(200).json({ message: 'Employee updated', employee }); } catch (e) { next(e); }
}
async function remove(req, res, next) {
  try { const employee = await Employee.findOneAndDelete({ _id: req.query.eid, user: req.auth.sub }); if (!employee) return res.status(404).json({ error: 'Employee not found' }); res.status(204).end(); } catch (e) { next(e); }
}
module.exports = { list, create, get, update, remove };
