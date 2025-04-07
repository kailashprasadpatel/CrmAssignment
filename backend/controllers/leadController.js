import Lead from '../models/Lead.js';

export const getLeads = async (req, res) => {
  const leads = await Lead.find().populate('createdBy', 'name');
  res.json(leads);
};

export const createLead = async (req, res) => {
  const { name, email, phone, address } = req.body;
  const lead = new Lead({ name, email, phone, address, createdBy: req.user._id });
  await lead.save();
  res.status(201).json(lead);
};

// updating the lead..
export const updateLead = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (address !== undefined) lead.address = address;

    await lead.save();
    res.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await Lead.deleteOne({ _id: req.params.id }); 
    res.json({ message: 'Lead removed' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateStatus = async (req, res) => {
  try {
    const { connected, response } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }


    lead.status.connected = Boolean(connected); 
    lead.status.response = response || '';
    lead.status.updatedAt = new Date();

    await lead.save();
    res.status(200).json({ message: 'Status updated successfully', lead });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};
