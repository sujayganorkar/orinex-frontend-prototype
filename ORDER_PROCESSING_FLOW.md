# Reimagined Order Processing Flow

## Overview

The new order processing flow transforms order management from a simple status-tracking system into an intelligent, step-by-step automated workflow. Orders now flow through four distinct sections with embedded processing capabilities.

## Four-Section Architecture

### 1. **Unread** Section
- New orders/inquiries received
- Awaiting initial processing
- **Action**: "Process Now" button triggers the processing workflow

### 2. **Pending** Section
- Orders undergoing quotation preparation
- Intermediate state during active processing
- Orders can move back to this state if additional verification is needed

### 3. **Quotations** Section
- Completed quotation requests
- Ready for client approval/follow-up
- Contains full processing history and details

### 4. **Invoices** Section
- Purchase orders that have been converted to invoices
- Final stage for PO-based orders
- Contains complete transaction records

---

## Processing Flow by Order Type

### **Type 1: Enquiry Order → Quotation**

```
UNREAD
  ↓
[Process Now Button Clicked]
  ↓
Step 1: EMAIL VERIFICATION
├─ Display received enquiry email
├─ Check for discrepancies
├─ Option: Send custom email if needed
└─ → Move to Step 2
  ↓
Step 2: QUOTATION GENERATION
├─ LLM generates quotation based on enquiry
├─ Display generated quotation
├─ Options:
│  ├─ Edit (manually modify quotation)
│  └─ Proceed (send as-is)
└─ → Move to Step 3
  ↓
Step 3: EMAIL DRAFTING
├─ LLM generates professional email draft
├─ Attach quotation as PDF
├─ Options:
│  ├─ Edit email content
│  └─ Send with Attachment
└─ → Move to Step 4
  ↓
Step 4: SUCCESS
├─ Order moved to QUOTATIONS section
├─ Display processing history
└─ Steps executed:
   ├─ Email verification
   ├─ Quotation generated
   └─ Email sent with attachment
```

### **Type 2: Purchase Order → Invoice**

```
UNREAD
  ↓
[Process Now Button Clicked]
  ↓
Step 1: EMAIL VERIFICATION
├─ Display received PO email
├─ Check for discrepancies
├─ Option: Send custom email if needed
└─ → Move to Step 2
  ↓
Step 2: INVOICE GENERATION
├─ LLM generates invoice based on PO
├─ Display generated invoice
├─ Options:
│  ├─ Edit (manually modify invoice)
│  └─ Proceed (send as-is)
└─ → Move to Step 3
  ↓
Step 3: EMAIL DRAFTING
├─ LLM generates professional email draft
├─ Attach invoice as PDF
├─ Options:
│  ├─ Edit email content
│  └─ Send with Attachment
└─ → Move to Step 4
  ↓
Step 4: SUCCESS
├─ Order moved to INVOICES section
├─ Display processing history
└─ Steps executed:
   ├─ Email verification
   ├─ Invoice generated
   └─ Email sent with attachment
```

---

## Component Structure

### `src/pages/orders.tsx`
- Main orders page with 4-tab navigation
- Displays orders filtered by status
- Shows "Process Now" button for unread orders
- Shows "View Details" button for processed orders
- Integrates `OrderProcessingModal`

### `src/components/OrderProcessingModal.tsx`
- Main modal component orchestrating the processing flow
- Manages step navigation based on order type
- Handles state transitions between processing steps
- Displays appropriate step component based on current state
- Supports both initial processing and historical viewing

### `src/components/OrderProcessing/EmailDiscrepancyStep.tsx`
- **Step 1 of processing**
- Displays the received email/inquiry
- Option to flag discrepancies
- If discrepancy detected: textarea for custom email
- Simulates sending custom email if needed

### `src/components/OrderProcessing/QuotationGenerationStep.tsx`
- **Step 2 for Enquiry orders**
- Simulates LLM-based quotation generation
- 2-second loading animation
- Non-editable view by default
- Edit button to manually modify quotation
- Proceed button to advance to next step

### `src/components/OrderProcessing/InvoiceGenerationStep.tsx`
- **Step 2 for Purchase Order**
- Simulates LLM-based invoice generation
- 2-second loading animation
- Non-editable view by default
- Edit button to manually modify invoice
- Proceed button to advance to next step

### `src/components/OrderProcessing/EmailDraftingStep.tsx`
- **Step 3 for both order types**
- Simulates LLM-based professional email drafting
- 1.5-second loading animation
- Shows PDF attachment indicator
- Edit button to modify email content
- "Send with Attachment" button to finalize

### `src/components/OrderProcessing/ProcessSuccessStep.tsx`
- **Step 4: Completion & History View**
- Success animation and confirmation
- Order summary with new status
- Timeline of all executed steps
- Next steps information
- Can be used to view historical processing details

---

## Key Features

### 1. **Smart Step-by-Step Processing**
- Each step builds on the previous one
- Clear progression from unread → processed → sent
- Visual feedback at each stage

### 2. **Email Discrepancy Handling**
- Optional step to address email issues before processing
- Custom email sending capability
- Prevents errors from bad data

### 3. **LLM-Generated Content**
- Quotations generated intelligently from enquiries
- Invoices generated from purchase orders
- Professional emails drafted automatically
- All content editable before sending

### 4. **Manual Editing Capabilities**
- Edit quotation after generation
- Edit invoice after generation
- Edit email before sending
- Full control over final output

### 5. **Processing History**
- Complete audit trail of executed steps
- Timestamps and step descriptions
- Accessible via "View Details" button on processed orders

### 6. **Order Status Tracking**
- Clear visual status badges
- Color-coded sections (Blue=Unread, Yellow=Pending, Green=Quotations, Purple=Invoices)
- Dynamic count indicators

---

## Data Structure

```typescript
interface Order {
  id: string;
  client: string;
  summary: string;
  time: string;
  status: 'unread' | 'pending' | 'quotations' | 'invoices';
  amount: string;
  priority: 'high' | 'medium' | 'low';
  enquiryEmail?: string;
  type?: 'enquiry' | 'purchase_order';
  processedDetails?: {
    steps: string[];
    timestamp: Date;
  };
}
```

---

## User Experience Flow

### Processing an Unread Order

1. User clicks "Process Now" on an unread order
2. Modal opens with Step 1: Email Verification
3. User reviews email and confirms (or sends custom email)
4. System automatically generates quotation/invoice
5. User reviews and optionally edits
6. System drafts professional email
7. User reviews and optionally edits
8. System sends email with PDF attachment
9. Order status changes to quotations/invoices
10. Success screen shows execution history

### Viewing Processed Order Details

1. User clicks "View Details" on a processed order
2. Modal opens showing execution history
3. User can see all steps that were executed
4. Timeline view with timestamps
5. Close to return to main orders page

---

## Technical Implementation Details

### State Management
- Uses React hooks (useState) for local state
- Each step component manages its own state
- Main modal orchestrates state transitions
- Order mutations propagated back to parent

### Loading States
- EmailDiscrepancyStep: 500ms (custom email sending)
- QuotationGenerationStep: 2000ms (LLM simulation)
- InvoiceGenerationStep: 2000ms (LLM simulation)
- EmailDraftingStep: 1500ms (email sending)

### Error Handling
- Validates email content before sending
- Prevents empty quotation/invoice submission
- Checks for required fields

### Accessibility
- Semantic HTML structure
- Clear button labels
- Disabled states for buttons during processing
- Loading indicators for long operations

---

## Future Enhancements

1. **Real API Integration**
   - Connect to actual LLM API for content generation
   - Save processing history to backend
   - Implement actual email sending via SMTP

2. **Template System**
   - Use pre-defined quotation templates
   - Customizable email templates
   - Invoice template variations

3. **Batch Processing**
   - Process multiple orders in sequence
   - Scheduled processing
   - Bulk operations

4. **Advanced Analytics**
   - Processing time metrics
   - Edit frequency tracking
   - Success/failure rates

5. **Notifications**
   - Real-time processing updates
   - Email delivery confirmation
   - Client response tracking

6. **Approval Workflow**
   - Manager approval before sending
   - Review and sign-off steps
   - Audit logging

---

## Testing the Flow

### Test Case 1: Process Enquiry Order
1. Click "Process Now" on ORD-2024-001 (Enquiry)
2. Skip email discrepancy (no custom email)
3. Review generated quotation
4. Edit and modify quotation
5. Proceed to email drafting
6. Edit email content
7. Send with attachment
8. Verify order moves to Quotations section

### Test Case 2: Process Purchase Order
1. Click "Process Now" on ORD-2024-003 (Purchase Order)
2. Send custom email due to discrepancy
3. Review generated invoice
4. Accept without editing
5. Proceed to email drafting
6. Accept generated email
7. Send with attachment
8. Verify order moves to Invoices section

### Test Case 3: View Processing History
1. Click "View Details" on ORD-2024-004 (in Quotations)
2. View complete processing timeline
3. See all executed steps with timestamps
4. Close modal and return to main page
