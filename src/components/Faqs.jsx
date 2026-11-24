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
                Our platform connects users with trusted service providers.
                Simply browse the services, choose what you need, and place a
                request. We’ll handle the rest, ensuring a seamless experience.
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
                Our platform is free to use for browsing and connecting with
                providers. Some premium services may have additional fees, which
                will be clearly mentioned during checkout.
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
                Our customer support team is available 24/7. Simply reach out
                through our chat feature or email us, and we’ll help resolve any
                issues promptly.
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
                Yes, you can cancel your request before it’s confirmed with no
                charges. After confirmation, cancellation policies may apply
                depending on the service provider.
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
                We offer a wide range of services, including home repairs,
                cleaning, moving, digital consultations, and more. Explore our
                categories to find what fits your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
