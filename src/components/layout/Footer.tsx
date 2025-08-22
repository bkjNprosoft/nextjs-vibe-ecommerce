const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="mb-4">
          <a href="#" className="px-3 hover:text-gray-900">회사소개</a>
          <a href="#" className="px-3 hover:text-gray-900">이용약관</a>
          <a href="#" className="px-3 hover:text-gray-900">개인정보처리방침</a>
        </div>
        <p>&copy; {new Date().getFullYear()} MyShop. All Rights Reserved.</p>
        <p className="text-sm mt-2">본 사이트는 포트폴리오 목적으로 제작되었습니다.</p>
      </div>
    </footer>
  );
};

export default Footer;
