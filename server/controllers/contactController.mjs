import Contact from "../models/Contact.mjs";
import catchAsync from "../utils/catchAsync.mjs";
import appError from "../utils/appError.mjs";
import sendEmail from "../utils/email.mjs";

// Create a new contact message (public — no auth required)
export const createContact = catchAsync(async (req, res, next) => {
  const { name, email, category, message } = req.body;

  if (!name || !email || !category || !message) {
    return next(new appError("All fields are required", 400));
  }

  const contact = await Contact.create({ name, email, category, message });

  res.status(201).json({
    status: "success",
    message: "Your message has been sent successfully!",
    data: contact,
  });
});

// Get all contacts (admin only)
export const getAllContacts = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: contacts.length,
    data: contacts,
  });
});

// Get a single contact by ID (admin only)
export const getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new appError("No contact found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: contact,
  });
});

// Update contact status (admin only)
export const updateContactStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!["new", "read", "replied", "archived"].includes(status)) {
    return next(new appError("Invalid status value", 400));
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    return next(new appError("No contact found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: contact,
  });
});

// Delete a contact (admin only)
export const deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new appError("No contact found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Reply to a contact message (admin only)
export const replyToContact = catchAsync(async (req, res, next) => {
  const { replyMessage } = req.body;

  if (!replyMessage || !replyMessage.trim()) {
    return next(new appError("Reply message is required", 400));
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new appError("No contact found with that ID", 404));
  }

  // Update contact with the reply
  contact.adminReply = replyMessage;
  contact.repliedAt = new Date();
  contact.status = "replied";
  await contact.save();

  // Try sending email reply (non-fatal if it fails)
  let emailSent = false;
  try {
    await sendEmail({
      email: contact.email,
      subject: `Re: Your ${contact.category} inquiry — EcoMart Support`,
      message: `Hi ${contact.name},\n\nThank you for contacting EcoMart. Here is our response to your inquiry:\n\n${replyMessage}\n\n---\nYour original message:\n${contact.message}\n\nBest regards,\nEcoMart Support Team`,
    });
    emailSent = true;
  } catch (err) {
    console.error("Failed to send reply email:", err.message);
  }

  res.status(200).json({
    status: "success",
    message: emailSent
      ? "Reply sent successfully!"
      : "Reply saved but email delivery failed.",
    emailSent,
    data: contact,
  });
});
