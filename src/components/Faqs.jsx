import { useBranding } from "../context/BrandingContext";

const Faqs = () => {
  const { settings } = useBranding();
  const faqData = settings.faqs || {};
  const items = Array.isArray(faqData.items) && faqData.items.length > 0 ? faqData.items : [
    {
      id: 1,
      question: "আপনাদের কার্যক্রম কীভাবে কাজ করে?",
      answer: "কার্যক্রমের তালিকা থেকে আপনার পছন্দের উদ্যোগ বেছে নিন। অর্থ অনুদানের ক্ষেত্রে বিকাশ, নগদ বা রকেটে টাকা পাঠিয়ে TrxID জমা দিন; সামগ্রী দিতে চাইলে কার্যক্রমের পাতায় বিস্তারিত দেখুন।",
    },
    {
      id: 2,
      question: "এই প্ল্যাটফর্ম ব্যবহার করতে কি কোনো ফি লাগে?",
      answer: "ওয়েবসাইটে কার্যক্রম দেখা ও অনুদানের তথ্য জমা দিতে কোনো সেবা ফি নেই। মোবাইল আর্থিক সেবাদাতার নিজস্ব লেনদেন ফি প্রযোজ্য হতে পারে।",
    },
    {
      id: 3,
      question: "সহায়তা প্রয়োজন হলে কী করব?",
      answer: "কোনো সহায়তা লাগলে যোগাযোগ পাতায় দেওয়া ইমেইল বা ফোন নম্বরে আমাদের সঙ্গে যোগাযোগ করুন।",
    },
    {
      id: 4,
      question: "অনুরোধ জমা দেওয়ার পর কি বাতিল করা যাবে?",
      answer: "অনুদানের তথ্য জমা দেওয়ার পর তা যাচাইয়ের আগে সংশোধন বা বাতিলের অনুরোধ করতে আমাদের সঙ্গে যোগাযোগ করুন। যাচাই হয়ে গেলে অনুদানের রসিদ তৈরি হতে পারে।",
    },
    {
      id: 5,
      question: "আপনারা কী ধরনের সহায়তা দেন?",
      answer: "আমরা শীতবস্ত্র বিতরণ, মানবিক সহায়তা এবং অনুদান কার্যক্রম পরিচালনা করি। চলমান কার্যক্রমের পাতায় বর্তমান উদ্যোগগুলো দেখুন।",
    },
  ];

  return (
    <section className="my-16">
      <div className="container mx-auto p-5 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          {faqData.title || "সাধারণ জিজ্ঞাসা"}
        </h2>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="collapse collapse-arrow bg-white shadow-sm border border-gray-100 rounded-xl">
              <input type="radio" name="my-accordion-2" defaultChecked={idx === 0} />
              <div className="collapse-title text-lg md:text-xl font-medium text-gray-800">
                {item.question}
              </div>
              <div className="collapse-content text-gray-600 leading-relaxed text-sm md:text-base">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
