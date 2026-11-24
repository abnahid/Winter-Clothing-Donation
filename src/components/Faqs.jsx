const Faqs = () => {
  return (
    <section className="my-16">
      <div className="container mx-auto p-5">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
          সাধারণ জিজ্ঞাসা
        </h2>

        <div className="space-y-5">
          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              আপনাদের কার্যক্রম কীভাবে কাজ করে?
            </div>
            <div className="collapse-content">
              <p>
                কার্যক্রমের তালিকা থেকে আপনার পছন্দের উদ্যোগ বেছে নিন। অর্থ অনুদানের ক্ষেত্রে বিকাশ, নগদ বা রকেটে টাকা পাঠিয়ে TrxID জমা দিন; সামগ্রী দিতে চাইলে কার্যক্রমের পাতায় বিস্তারিত দেখুন।
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              এই প্ল্যাটফর্ম ব্যবহার করতে কি কোনো ফি লাগে?
            </div>
            <div className="collapse-content">
              <p>
                ওয়েবসাইটে কার্যক্রম দেখা ও অনুদানের তথ্য জমা দিতে কোনো সেবা ফি নেই। মোবাইল আর্থিক সেবাদাতার নিজস্ব লেনদেন ফি প্রযোজ্য হতে পারে।
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              সহায়তা প্রয়োজন হলে কী করব?
            </div>
            <div className="collapse-content">
              <p>
                কোনো সহায়তা লাগলে যোগাযোগ পাতায় দেওয়া ইমেইল বা ফোন নম্বরে আমাদের সঙ্গে যোগাযোগ করুন।
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              অনুরোধ জমা দেওয়ার পর কি বাতিল করা যাবে?
            </div>
            <div className="collapse-content">
              <p>
                অনুদানের তথ্য জমা দেওয়ার পর তা যাচাইয়ের আগে সংশোধন বা বাতিলের অনুরোধ করতে আমাদের সঙ্গে যোগাযোগ করুন। যাচাই হয়ে গেলে অনুদানের রসিদ তৈরি হতে পারে।
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              আপনারা কী ধরনের সহায়তা দেন?
            </div>
            <div className="collapse-content">
              <p>
                আমরা শীতবস্ত্র বিতরণ, মানবিক সহায়তা এবং অনুদান কার্যক্রম পরিচালনা করি। চলমান কার্যক্রমের পাতায় বর্তমান উদ্যোগগুলো দেখুন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
