'use client';

import { 
  Car, 
  Shield, 
  Clock, 
  Users, 
  Award, 
  Heart,
  Target,
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, label: 'Khách hàng', value: '10,000+' },
    { icon: Car, label: 'Xe cho thuê', value: '500+' },
    { icon: Clock, label: 'Năm kinh nghiệm', value: '5+' },
    { icon: Award, label: 'Giải thưởng', value: '15+' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Uy tín',
      description: 'Cam kết minh bạch, rõ ràng trong mọi giao dịch và dịch vụ',
    },
    {
      icon: Heart,
      title: 'Tận tâm',
      description: 'Luôn đặt sự hài lòng của khách hàng lên hàng đầu',
    },
    {
      icon: Target,
      title: 'Chuyên nghiệp',
      description: 'Đội ngũ nhân viên được đào tạo bài bản, chu đáo',
    },
    {
      icon: TrendingUp,
      title: 'Phát triển',
      description: 'Không ngừng cải tiến và nâng cao chất lượng dịch vụ',
    },
  ];

  const features = [
    'Xe mới, đa dạng chủng loại',
    'Giá cả cạnh tranh, minh bạch',
    'Bảo hiểm toàn diện',
    'Hỗ trợ 24/7',
    'Giao xe tận nơi',
    'Thủ tục đơn giản, nhanh chóng',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Về AutoDrive</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Dịch vụ cho thuê xe tự lái hàng đầu Việt Nam, mang đến trải nghiệm 
              lái xe an toàn, tiện lợi và đáng tin cậy cho mọi hành trình của bạn
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
              Câu chuyện của chúng tôi
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                AutoDrive được thành lập vào năm 2019 với sứ mệnh mang đến dịch vụ cho thuê xe 
                tự lái chất lượng cao, an toàn và tiện lợi cho người dân Việt Nam. Xuất phát từ 
                niềm đam mê với ô tô và mong muốn cải thiện trải nghiệm di chuyển, chúng tôi đã 
                không ngừng nỗ lực để xây dựng một nền tảng cho thuê xe hiện đại và đáng tin cậy.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Trải qua hơn 5 năm hoạt động, AutoDrive đã phục vụ hơn 10,000 khách hàng với 
                đội xe đa dạng từ sedan, SUV đến xe 7 chỗ và xe sang. Chúng tôi tự hào là đối tác 
                tin cậy đồng hành cùng hàng ngàn chuyến đi của khách hàng trên khắp cả nước.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Với đội ngũ chủ xe và nhân viên chuyên nghiệp, tận tâm, cùng hệ thống quản lý 
                hiện đại, AutoDrive cam kết mang đến cho bạn trải nghiệm thuê xe tốt nhất, 
                giúp mọi chuyến đi của bạn trở nên dễ dàng và thoải mái hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Giá trị cốt lõi
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Những giá trị chúng tôi tin tưởng và thực hiện trong mọi hoạt động
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Tại sao chọn AutoDrive?
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Những lý do khách hàng tin tưởng và lựa chọn chúng tôi
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-gray-900 font-medium text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Những đánh giá chân thực từ khách hàng
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Nguyễn Văn A',
                role: 'Khách hàng thân thiết',
                comment: 'Dịch vụ tuyệt vời! Xe sạch sẽ, thủ tục đơn giản. Tôi đã thuê xe nhiều lần và luôn hài lòng.',
                rating: 5,
              },
              {
                name: 'Trần Thị B',
                role: 'Doanh nhân',
                comment: 'AutoDrive là lựa chọn hàng đầu của tôi cho các chuyến công tác. Chuyên nghiệp và đáng tin cậy.',
                rating: 5,
              },
              {
                name: 'Lê Văn C',
                role: 'Du khách',
                comment: 'Trải nghiệm tuyệt vời! Hỗ trợ 24/7 rất tốt. Chắc chắn sẽ quay lại lần sau.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-md"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Đặt xe ngay hôm nay và trải nghiệm dịch vụ tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/cars"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Xem xe cho thuê
            </a>
            <a
              href="/contact"
              className="inline-block bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition border-2 border-white"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
