class User < ActiveRecord::Base
  has_many :guesses
  belongs_to :paired_user, :class_name => 'User', :foreign_key => 'paired_user_id', :primary_key => 'id'

  scope :queued, lambda { |current_id| where("queued = (?) AND logged_in = (?) and id != (?)",
                                             true, true, current_id).limit(1).order('random()') }

  attr_accessor :force_unpair


  def pair
    pair = paired_user
    unless pair
      pair = User.queued(self.id).first
      if pair
        self.update_attributes(:paired_user_id => pair.id, :queued => false)
        pair.update_attributes(:queued => false, :paired_user => self)
      end
    end
    pair
  end

  def unpair
    if u = paired_user
      self.update_attributes(:paired_user_id => nil, :queued => true)
      u.update_attributes(:paired_user_id => nil, :queued => true)
    end
  end
end