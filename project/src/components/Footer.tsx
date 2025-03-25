import React from 'react';
import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>para a comunidade do Poker</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2024 GTO Poker Study Tool. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;